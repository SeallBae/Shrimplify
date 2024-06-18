const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const moment = require("moment");
const connection = require("../config/dbconnection");
const path = require("node:path");
const spawn = require("child_process").spawn;

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        let id = uuid.v4();
        let statId = req.body.statId;

        let date = moment().format("YYYY-MM-DD HH:mm:ss");
        let num_stat = req.body.num_stat;

        let sql =
            "INSERT INTO DATASET (ID, statId, history_date, num_stat) VALUES (?,?,?,?)";
        console.log(id);
        console.log(statId);
        console.log(date);
        console.log(num_stat);
        if (id && statId && num_stat) {
            connection.query(
                sql,
                [id, statId, date, num_stat],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json("Cannot save a data!");
                    } else {
                        res.status(200).json(results);
                    }
                }
            );
        }
        return;
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/create", async (req, res) => {
    try {
        let name = req.body.name;

        let sql = "INSERT INTO IOT_DEVICE (name) VALUES (?);";

        if (name) {
            connection.query(sql, name, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot save a data!");
                } else {
                    res.status(200).json(results.length ? 0 : 1);
                }
            });
        }
        return;
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/check", async (req, res) => {
    try {
        let iotId = req.body.iotId;

        let sql = "SELECT * FROM IOT_DEVICE WHERE IOT_DEVICE.id = ? LIMIT 1;";

        if (iotId) {
            connection.query(sql, iotId, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot save a data!");
                } else {
                    res.status(200).json(results.length ? 1 : 0);
                }
            });
        }
        return;
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/max", async (req, res) => {
    try {
        let sql = "SELECT MAX(id) as last_id FROM IOT_DEVICE;";

        connection.query(sql, (err, results) => {
            if (err) {
                res.status(400).json("Cannot save a data!");
            } else {
                res.status(200).json(results[0].last_id);
            }
        });

        return;
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/crop", async (req, res) => {
    try {
        let iot_id = req.body.iotId;
        let sql = "SELECT cropId FROM CROP_STAT WHERE iotId = ? LIMIT 1;";

        connection.query(sql, iot_id, (err, results) => {
            if (err) {
                res.status(400).json("Dont have data!");
            } else {
                res.status(200).json(results[0] ? results[0].cropId : "");
            }
        });

        return;
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/predict", (req, res) => {
    var process = spawn("python3", [
        path.resolve("./data/Classification.py"),
        req.query.pH,
        req.query.temp,
        req.query.turbidity,
        req.query.do,
        req.query.conductivity,
    ]);
    let output = "";
    process.stdout.setEncoding("utf-8");
    process.stdout.on("data", function (data) {
        console.log("stdout: " + data);
        output += data.toString();
    });
    process.stderr.on("data", function (data) {
        console.log("stderr: " + data);
        output += data.toString();
    });
    process.on("error", () => {
        console.log("Fail to start child_process.");
    });
    process.stdout.on("end", () => {
        res.status(200).json(output.replace("\r\n", "").replace("\n", ""));
    });
});

module.exports = router;
