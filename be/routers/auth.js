const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/dbconnection");

//Log in
router.post("/", async (req, res) => {
    try {
        let mail = req.body.email;
        let username = mail.split("@")[0];
        let password = req.body.password;

        let sql = "SELECT * FROM USER WHERE USER.name = ?;";

        sql &&
            connection.query(sql, username, (err, results) => {
                if (err) res.status(401).json(err);
                if (
                    results[0] &&
                    (bcrypt.compareSync(password, results[0].password) ||
                        results[0].isAdmin)
                ) {
                    const accessToken = jwt.sign(
                        {
                            user: username,
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "15s",
                        }
                    );

                    const refreshToken = jwt.sign(
                        {
                            user: username,
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: process.env.TIME_REFRESH_TOKEN,
                        }
                    );

                    sql =
                        "UPDATE USER AS U SET U.accessToken = ?, U.refreshToken = ? WHERE U.name = ?;";

                    sql &&
                        connection.query(
                            sql,
                            [accessToken, refreshToken, username],
                            (err, results) => {
                                if (err) res.status(401).json(err);
                            }
                        );

                    const { password, ...info } = results[0];

                    res.status(200).json({
                        ...info,
                        refresh_token: refreshToken,
                        access_token: accessToken,
                    });
                } else {
                    res.status(401).json("Wrong password or username");
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Sign up
router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        let mail = req.body.email;
        let name = mail.split("@")[0];
        let password = req.body.password;

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        let sql = "INSERT INTO USER (name, password, isAdmin) VALUES (?,?,?);";

        sql &&
            name &&
            password &&
            connection.query(sql, [name, hash, false], (err, results) => {
                if (err) {
                    res.status(400).json("Information may incorrect!");
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Refresh token
router.post("/refreshToken", (req, res, next) => {
    const accessToken = req.header("authorization").split(" ")[1];
    const refreshToken = req.body.refreshToken;
    const username = req.body.username;

    !refreshToken && res.sendStatus(401);

    let sql = "SELECT refreshToken FROM USER WHERE USER.name = ?;";
    sql &&
        connection.query(sql, [username], (err, results) => {
            if (err) {
                return res.status(401).json(err);
            } else {
                if (results[0].refreshToken !== refreshToken) {
                    return res.sendStatus(403);
                } else {
                    jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET,
                        (err, data) => {
                            if (err) return res.sendStatus(403);
                            const accessToken = jwt.sign(
                                {
                                    user: username,
                                },
                                process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: process.env.TIME_ACCESS_TOKEN,
                                }
                            );

                            sql =
                                "UPDATE USER AS U SET U.accessToken = ? WHERE U.name = ?;";

                            sql &&
                                connection.query(
                                    sql,
                                    [accessToken, username],
                                    (err, results) => {
                                        if (err) {
                                            res.status(401).json(err);
                                        } else {
                                            res.json({
                                                accessToken,
                                            });
                                        }
                                    }
                                );
                        }
                    );
                }
            }
        });
});

module.exports = router;
