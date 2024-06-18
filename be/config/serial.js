const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const serialPart = process.env.SERIAL_PATH || "\\\\.\\COM3";

const serialPort = new SerialPort(
  {
    path: serialPart,
    baudRate: 9600,
    dataBits: 8,
    flowControl: false,
    parity: "none",
    stopBits: 1,
  },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
  }
);

const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

module.exports = parser;

// function createParser() {
//   const serialPort = new SerialPort(
//     {
//       path: serialPart,
//       baudRate: 9600,
//       dataBits: 8,
//       flowControl: false,
//       parity: "none",
//       stopBits: 1,
//     },
//     function (err) {
//       if (err) {
//         return console.log("Error: ", err.message);
//       }
//     }
//   );

//   const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
//   return parser;
// }

// module.exports = createParser();
