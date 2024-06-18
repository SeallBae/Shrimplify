// const parser = require("./serial");
const { SerialPort } = require("serialport");

const socketFunction = (io) => {
    io.on("connection", (client) => {
        console.log("Socket on!");

        client.on("init_tracking", (list_cropIds) => {
            list_cropIds.forEach((crop_id) => client.join(crop_id));
        });

        client.on("create_tracking", (crop_id) => {
            client.join(crop_id);
        });

        client.on("get_port_list", () => {
            SerialPort.list().then(function (ports) {
                client.emit("port_list", ports);
            });
        });

        client.on("FE_TRACKING_BY_CROP", (crop_id) => {
            client.broadcast.emit("sIOtype_EVENT", "GET_CROP", crop_id);
        });

        client.on("START_TRACKING_ARDUINO", (data) => {
            console.log(data);
            client.emit("sIOtype_EVENT", "START_SOCKET_FROM_BACKEND", "");
        });

        client.on("RECEIVE_DATA_FROM_ARDUINO", (data, cropId) => {
            console.log(data);
            if (data && cropId) {
                console.log("cropID " + cropId.cropId);
                client.broadcast
                    .to(cropId?.cropId)
                    .emit(`temperature_${cropId?.cropId}`, +data.Temp);
            }
        });

        client.on("disconnect", (data) => {
            console.log("Disconnect socket!");
        });
    });

    // parser.on("data", function (data) {
    //   const temp = data.trim().split(";");

    //   const rooms = io.sockets.adapter.rooms;
    //   for (const [key, value] of rooms) {
    //     io.to(key).emit(`Temp_${key}`, +temp);
    //   }
    // });
};

module.exports = socketFunction;
