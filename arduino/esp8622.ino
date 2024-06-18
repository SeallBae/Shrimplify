#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>
#include <ArduinoJson.h>
#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
SocketIOclient socketIO;

// IPAddress serverIP(139, 99, 57, 31);
String serverIP = "shrimp-api.winggs.site";
uint16_t serverPort = 80;

const char* init_ssid = "WINGgS";
const char* init_password = "winggs7!";

const char* GET = "GET";
const char* POST = "POST";
const char* PUT = "GET";
const char* DELETE = "DELETE";

//SOCKET: EVENT NAME
const char* CHANGE_WIFI = "CHANGE_WIFI";
const char* GET_CROP = "GET_CROP";
const char* START_SOCKET = "START_SOCKET_FROM_BACKEND";

const String baseURL = "http://shrimp-api.winggs.site/";
const String apiSendData = "data?statId=1";
const String checkIoTConnected = "data/check";
const String createIoTDevice = "data/create";
const String getCropByIot = "data/crop";

const int delayTime = 10000;
unsigned long messageTimestamp = 0;

bool isRunningSocket = false;

int iot_id = 1;
String crop_id = "";

void setup() {
  Serial.begin(9600);

  while (!Serial)
    ;

  connectToWifi(init_ssid, init_password);

  socketIO.setReconnectInterval(10000);
  socketIO.begin(serverIP, serverPort);
  socketIO.onEvent(socketIOEvent);
  delay(200);
  sendDataSocket("START_TRACKING_ARDUINO", { "isConnect" }, { "true" });

  if (callApi(baseURL + checkIoTConnected, POST, "{\"iotId\":\"" + String(iot_id) + "\"}") == "1") {
    String response = callApi(baseURL + getCropByIot, POST, "{\"iotId\":\"" + String(iot_id) + "\"}");
    if (response != "") {
      crop_id = response;
    }
  } else {
    callApi(baseURL + createIoTDevice, POST, "{\"name\":\"" + String(iot_id) + "\"}");
  }
}

void loop() {
  socketIO.loop();
  uint64_t now = millis();

  if (now - messageTimestamp > delayTime) {
    messageTimestamp = now;

    if (isRunningSocket == false) {
      Serial.println("Socket connection lost. Reconnecting...");
      sendDataSocket("START_TRACKING_ARDUINO", { "isConnect" }, { "true" });
    } else {
      if (WiFi.status() == WL_CONNECTED) {
        if (iot_id > 0) {
          String data = Serial.readStringUntil('\n');

          Serial.println("Before Temp: " + data);
          data.trim();
          Serial.println("Temp: " + data);

          if (data.length() > 0) {
            String response = callApi(baseURL + apiSendData, POST, "{\"statId\":\"1\",\"num_stat\":\"" + data + "\"}");
            if (response != "" && crop_id != "") {
              Serial.println("CropId: " + crop_id);
              sendDataSocket("RECEIVE_DATA_FROM_ARDUINO", { "Temp", "cropId" }, { data, crop_id });
            }
          }
        }

      } else {
        Serial.println("WiFi connection lost. Reconnecting...");
        WiFi.reconnect();
      }
    }
  }
}

String callApi(String url, const char* method, String data) {
  String response = "";
  WiFiClient wifiClient;
  HTTPClient http;
  http.begin(wifiClient, (url).c_str());
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.sendRequest(method, data);
  if (httpResponseCode > 0) {
    response = http.getString();
    Serial.println("API Response: " + response);
  } else {
    Serial.print("Error in sending data to API check IoT connected. Error code: ");
    Serial.println(httpResponseCode);
  }
  return response;
}

void sendDataSocket(const char* eventName, const std::vector<String>& keys, const std::vector<String>& values) {
  if (eventName && keys.size() == values.size()) {
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    array.add(eventName);
    for (int i = 0; i < keys.size(); i++) {
      JsonObject param = array.createNestedObject();
      param[keys[i]] = values[i];
      delay(10);
    }

    String output;
    serializeJson(doc, output);
    // Send event
    socketIO.sendEVENT(output);
  }
}

void connectToWifi(const char* ssid, const char* password) {
  if (WiFi.getMode() & WIFI_AP) {
    WiFi.softAPdisconnect(true);
  }

  WiFiMulti.addAP(ssid, password);

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    delay(100);
  }

  Serial.println("WiFi connected");
  Serial.println("IP address: " + WiFi.localIP().toString());
  Serial.println("Server started");
}

void socketIOEvent(const socketIOmessageType_t& type, uint8_t* payload, const size_t& length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      Serial.println("[IOc] Disconnected");
      isRunningSocket = false;
      break;

    case sIOtype_CONNECT:
      Serial.print("[IOc] Connected to url: ");
      Serial.println(length);
      Serial.println((char*)payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");

      break;

    case sIOtype_EVENT:
      {
        char* jsonString = nullptr;
        char* eventString = nullptr;
        const char* delimiter = ",";

        Serial.println("[IOc] Get event: ");
        eventString = reinterpret_cast<char*>(payload);

        if (eventString[0] == '[' && eventString[length - 1] == ']') {
          eventString[length - 1] = '\0';
          eventString++;
        }

        // Convert eventString to an array separated by spaces
        char** eventArray = nullptr;
        int eventCount = 0;

        // Tokenize the eventString
        char* token = strtok(eventString, delimiter);
        while (token != nullptr) {
          // Remove quotation marks from each element
          if (token[0] == '"' && token[strlen(token) - 1] == '"') {
            token[strlen(token) - 1] = '\0';
            token++;
          }

          eventArray = (char**)realloc(eventArray, (eventCount + 1) * sizeof(char*));
          eventArray[eventCount] = token;
          eventCount++;
          token = strtok(nullptr, delimiter);
        }

        Serial.println(eventArray[1]);
        if (strcmp(eventArray[1], START_SOCKET) == 0) {
          if (!isRunningSocket) {
            isRunningSocket = true;
          }
        }

        if (strcmp(eventArray[1], CHANGE_WIFI) == 0) {
          const char* ssid = eventArray[2];
          const char* password = eventArray[3];
          delay(200);
          connectToWifi(ssid, password);
        }

        if (strcmp(eventArray[1], GET_CROP) == 0) {
          if (crop_id != "") {
            crop_id = eventArray[2];
          }
        }

        if (!isRunningSocket) {
          isRunningSocket = true;
        }

        // Free the dynamically allocated memory
        free(eventArray);
        Serial.println(isRunningSocket);

        break;
      }

    case sIOtype_ACK:
      Serial.print("[IOc] Get ack: ");
      Serial.println(length);

      hexdump(payload, length);
      break;

    case sIOtype_ERROR:
      Serial.print("[IOc] Get error: ");
      Serial.println(length);

      hexdump(payload, length);
      break;

    case sIOtype_BINARY_EVENT:
      Serial.print("[IOc] Get binary: ");
      Serial.println(length);

      hexdump(payload, length);
      break;

    case sIOtype_BINARY_ACK:
      Serial.print("[IOc] Get binary ack: ");
      Serial.println(length);

      hexdump(payload, length);
      break;

    case sIOtype_PING:
      Serial.println("[IOc] Get PING");

      break;

    case sIOtype_PONG:
      Serial.println("[IOc] Get PONG");

      break;

    default:
      break;
  }
}