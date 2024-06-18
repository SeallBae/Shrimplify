#include <DallasTemperature.h>
#include <OneWire.h>

#define ONE_WIRE_BUS 2
#define RELAY 7

OneWire oneWire(ONE_WIRE_BUS);

DallasTemperature DS18B20(&oneWire);

// int lower_limit = 29;
int upper_limit = 29;
float tempC;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(RELAY, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  getTemperature();
  Serial.println(tempC);

  if (DS18B20.getTempCByIndex(0) < upper_limit){
    digitalWrite(RELAY, HIGH);
  } else{ 
    digitalWrite(RELAY, LOW);
  }
  delay(5000);

}

void getTemperature() {
  do {
    DS18B20.requestTemperatures();
    tempC = DS18B20.getTempCByIndex(0);
    if (tempC == (-127)) {
      delay(100);
    }
  } while (tempC == (-127.0));
}
