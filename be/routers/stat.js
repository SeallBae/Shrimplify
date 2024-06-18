const express = require("express");
const router = express.Router();
const connection = require("../config/dbconnection");

//Update a stat
router.put("/", async (req, res) => {
    try {
        let id = req.body.id;
        let userName = req.body.userName;
        let statFrom = req.body.from_stat;
        let statTo = req.body.to_stat;

        let isAdmin = true;

        let check_role_sql = "SELECT isAdmin FROM USER WHERE name = ?;";

        connection.query(check_role_sql, userName, (err, results) => {
            if (err) {
                res.status(500).json(err);
            } else {
                isAdmin = +results[0].isAdmin;

                if (!isAdmin) {
                    console.log("Reach");
                    return res
                        .status(400)
                        .json("You dont have permission to do this!");
                }

                let sql =
                    "UPDATE STAT AS S SET S.from_stat = ?, S.to_stat = ? WHERE S.ID = ?;";

                if (statFrom < statTo) {
                    connection.query(
                        sql,
                        [statFrom, statTo, id],
                        (err, results) => {
                            if (err) {
                                res.status(400).json(
                                    "Cannot update this stat!"
                                );
                            } else {
                                res.status(200).json(results);
                            }
                        }
                    );
                } else {
                    res.status(400).json(
                        "Stat-from must smaller than the Stat-to!"
                    );
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a stat
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let sql = "SELECT * FROM STAT WHERE STAT.ID = ?;";

        id &&
            connection.query(sql, id, (err, results) => {
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

//get all stat
router.get("/", async (req, res) => {
    try {
        let sql = "SELECT * FROM STAT;";

        connection.query(sql, (err, results) => {
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

module.exports = router;
