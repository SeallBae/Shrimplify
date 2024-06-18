const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const moment = require("moment");
const connection = require("../config/dbconnection");

//Get all crops
router.get("/pond/:pondID", async (req, res) => {
    try {
        let pondID = req.params.pondID;
        let sql = "SELECT * FROM CROP WHERE CROP.pondID = ?;";
        connection.query(sql, pondID, (err, results) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get all crops are tracking by stat
router.get("/tracking/:userName", async (req, res) => {
    try {
        let name = req.params.userName;
        let statID = req.query.statID;
        let sql =
            "SELECT cropId as id FROM CROP_STAT WHERE isActive = TRUE AND statId = ? AND cropId IN (" +
            "SELECT CROP.id FROM CROP JOIN POND ON CROP.pondId = POND.id JOIN USER ON POND.userName = USER.name " +
            "WHERE USER.name = ? );";
        connection.query(sql, [statID, name], (err, results) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get info of a crop
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let sql = "SELECT * FROM CROP WHERE CROP.ID = ?;";

        id &&
            connection.query(sql, id, (err, results) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    results.length > 0
                        ? res.status(200).json(results)
                        : res.status(200).json("Cant find any crop!");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get all the stat in a crop
router.get("/stat/:id", async (req, res) => {
    try {
        let cropID = req.params.id;

        let sql = "SELECT * FROM CROP_STAT WHERE CROP_STAT.cropID = ?;";

        cropID &&
            connection.query(sql, cropID, (err, results) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    results.length > 0
                        ? res.status(200).json(results)
                        : res.status(200).json("");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Create a crop
router.post("/", async (req, res) => {
    try {
        let id = uuid.v4();
        let pondID = req.body.pondId;
        let type = req.body.type;
        let number = req.body.number;

        let date = moment().format("YYYY-MM-DD");

        const sql =
            "INSERT INTO CROP (ID, pondID, type, number, startDate) VALUES (?,?,?,?,?);";

        if (id && pondID && type && number) {
            connection.query(
                sql,
                [id, pondID, type, number, date],
                (err, results) => {
                    if (err) {
                        res.status(400).json(
                            "Cannot create a crop! Check data again, please!"
                        );
                    } else {
                        res.status(200).json(id);
                    }
                }
            );
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

//Delete a crop
router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        //Delete crop-stat
        let sql =
            "DELETE FROM CROP_STAT " +
            "WHERE CROP_STAT.cropID IN " +
            "( SELECT c.ID FROM CROP AS c " +
            "WHERE c.ID = ? );";

        //Delete daily history
        sql +=
            "DELETE FROM DAILY_HISTORY " +
            "WHERE DAILY_HISTORY.cropID IN " +
            "( SELECT c.ID FROM CROP AS c " +
            "WHERE c.ID = ? );";

        //Delete crops and pond
        sql += "DELETE FROM CROP WHERE CROP.ID = ?;";

        id &&
            connection.query(sql, [id, id, id, id], (err, results) => {
                if (err) {
                    res.status(400).json("Cannot delete this crop!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update a crop
router.put("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.body.type;
        let number = req.body.number;

        let cropInfo = {
            type: JSON.stringify(type),
            number,
        };

        let sql = "UPDATE CROP AS P SET ,{0},{1} WHERE P.ID = ?;";

        Object.keys(cropInfo).forEach((key, index) => {
            cropInfo[key]
                ? (sql = sql.replace(
                      `,{${index}}`,
                      `P.${key} = ${cropInfo[key]},`
                  ))
                : (sql = sql.replace(`,{${index}}`, ``));
            if (index == 1) sql = sql.replace(", WHERE", " WHERE");
        });

        if (type || number) {
            connection.query(sql, id, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot update this crop!");
                } else {
                    res.status(200).json(results);
                }
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//Choose stats to track for a crop
router.post("/stat/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let lstStats = req.body.lstStats;
        let lstActive = req.body.lstActive;

        const stats = lstStats.split(",");
        const active = lstActive.split(",");
        let sqlOptions = "";
        const statsObj = [];

        if (Array.isArray(stats)) {
            stats.map((stat, index) => {
                if (stats.length - 1 === index) {
                    sqlOptions += "(?,?,?)";
                } else {
                    sqlOptions += "(?,?,?), ";
                }
                statsObj.push(id);
                statsObj.push(stat);
                statsObj.push(active[index]);
            });
        }
        let sql = `INSERT INTO CROP_STAT (cropID, statID, isActive) VALUES {0}`;
        let newSql = sql.replace("{0}", sqlOptions);

        id &&
            connection.query(newSql, statsObj, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot update this stat for crop!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update stats to track for a crop
router.put("/stat/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let statId = req.body.statId;
        let isActive = req.body.isActive;

        console.log("id " + id);
        console.log("statid " + statId);
        console.log("isActive" + isActive);

        let sql = `UPDATE CROP_STAT SET isActive = ? WHERE cropID = ? AND statID = ?;`;

        id &&
            connection.query(sql, [isActive, id, statId], (err, results) => {
                if (err) {
                    res.status(400).json("Cannot update this stat for crop!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update iotDevice to track for a crop
router.put("/stat/iot/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let statId = req.body.statId;
        let iotId = req.body.iotId;

        let checksql = "SELECT * FROM CROP_STAT WHERE CROP_STAT.iotId = ?;";

        iotId &&
            connection.query(checksql, [iotId], (err, results) => {
                if (err) {
                    res.status(401).json("Cannot update this stat for crop!");
                } else {
                    if (!results.length) {
                        let sql = `UPDATE CROP_STAT SET iotId = ? WHERE cropID = ? AND statID = ?;`;

                        id &&
                            connection.query(
                                sql,
                                [iotId, id, statId, iotId],
                                (err, results) => {
                                    if (err) {
                                        res.status(400).json(
                                            "Cannot update this stat for crop!"
                                        );
                                    } else {
                                        res.status(200).json(results);
                                    }
                                }
                            );
                    }
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete stat for crop
router.delete("/stat/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let statIds = req.body.statIDs;

        const stats = statIds.split(",");
        let sqlOptions = "";
        const statsObj = [id];

        if (Array.isArray(stats)) {
            stats.map((stat, index) => {
                if (index === 0) {
                    sqlOptions += "CROP_STAT.statID = ? ";
                } else {
                    sqlOptions += "OR CROP_STAT.statID = ? ";
                }
                statsObj.push(stat);
            });
        }

        let sql = `DELETE FROM CROP_STAT WHERE CROP_STAT.cropID = ? AND ({0});`;
        let newSql = sql.replace("{0}", sqlOptions);

        id &&
            connection.query(newSql, statsObj, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot delete this stat!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get all histories
router.get("/history/all/:id", async (req, res) => {
    try {
        let cropID = req.params.id;

        let sql =
            "SELECT * FROM DAILY_HISTORY WHERE DAILY_HISTORY.cropID = ? ORDER BY history_date DESC LIMIT 100;";

        cropID &&
            connection.query(sql, cropID, (err, results) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    results.length > 0
                        ? res.status(200).json(results)
                        : res.status(200).json("");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get one history
router.get("/history/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let sql = "SELECT * FROM DAILY_HISTORY WHERE DAILY_HISTORY.ID = ?;";

        id &&
            connection.query(sql, id, (err, results) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    results.length > 0
                        ? res.status(200).json(results)
                        : res.status(200).json("Cant find any history!");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get history of stat
router.get("/history/stat/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let cropID = req.query.cropID;

        let sql =
            "SELECT * FROM DAILY_HISTORY WHERE DAILY_HISTORY.statId = ? AND DAILY_HISTORY.cropID = ?;";

        id &&
            connection.query(sql, [id, cropID], (err, results) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    results.length > 0
                        ? res.status(200).json(results)
                        : res.status(200).json("Cant find any history!");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Create/Save history
router.post("/history", async (req, res) => {
    try {
        let id = uuid.v4();
        let cropId = req.body.cropId;
        let statId = req.body.statId;
        let isDanger = req.body.isDanger;

        let date = moment().format("YYYY-MM-DD HH:mm:ss");
        let num_stat = req.body.num_stat;
        let description = req.body.description;

        let sql =
            "INSERT INTO DAILY_HISTORY (ID, cropID, statID, history_date, num_stat, isDanger ,description) VALUES (?,?,?,?,?,?,?)";

        if (id && cropId && statId && num_stat) {
            connection.query(
                sql,
                [id, cropId, statId, date, num_stat, isDanger, description],
                (err, results) => {
                    if (err) {
                        res.status(400).json("Cannot save a history!");
                    } else {
                        res.status(200).json(results);
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete history
router.delete("/history/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let sql = "DELETE FROM DAILY_HISTORY AS D WHERE D.cropID = ?;";

        id &&
            connection.query(sql, id, (err, results) => {
                if (err) {
                    res.status(400).json("Cannot delete this history!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
