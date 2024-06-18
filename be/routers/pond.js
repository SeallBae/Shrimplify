const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const moment = require("moment");
const authenToken = require("../verifyToken");
const connection = require("../config/dbconnection");

//Get all ponds
router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    let sql = "SELECT * FROM POND WHERE POND.username = ?;";
    sql &&
      username &&
      connection.query(sql, username, (err, results) => {
        if (err) {
          res.status(500).json(err);
        } else {
          results && res.status(200).json(results);
        }
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get info of a pond
router.get("/p/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let sql = "SELECT * FROM POND WHERE POND.ID = ?;";

    id &&
      connection.query(sql, id, (err, results) => {
        if (err) {
          res.status(500).json(err);
        } else {
          results.length > 0
            ? res.status(200).json(results)
            : res.status(200).json("Cant find any pond!");
        }
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Create a pond
router.post("/", async (req, res) => {
  try {
    let id = uuid.v4();
    let username = req.body.userName;
    let name = req.body.name;
    let area = req.body.area;
    let deep = req.body.deep;

    let date = moment().format("YYYY-MM-DD");

    const sql =
      "INSERT INTO POND (ID, username, name, area, deep, startDate) VALUES (?,?,?,?,?,?);";

    if (name && area && deep) {
      connection.query(
        sql,
        [id, username, name, area, deep, date],
        (err, results) => {
          if (err) {
            res
              .status(400)
              .json("Cannot create a pond! Check data again, please!");
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

//Update a pond
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let name = req.body.name;
    let area = req.body.area;
    let deep = req.body.deep;

    let pondInfo = {
      name: JSON.stringify(name),
      area,
      deep,
    };

    let sql = "UPDATE POND AS P SET ,{0},{1},{2} WHERE P.ID = ?;";

    Object.keys(pondInfo).forEach((key, index) => {
      pondInfo[key]
        ? (sql = sql.replace(`,{${index}}`, `P.${key} = ${pondInfo[key]},`))
        : (sql = sql.replace(`,{${index}}`, ``));
      if (index == 2) sql = sql.replace(", WHERE", " WHERE");
    });

    if (name || area || deep) {
      connection.query(sql, id, (err, results) => {
        if (err) {
          res.status(400).json("Cannot update this pond!");
        } else {
          res.status(200).json(results);
        }
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete a pond
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;

    //Delete crop-stat
    let sql =
      "DELETE FROM CROP_STAT " +
      "WHERE CROP_STAT.cropID IN " +
      "( SELECT c.ID FROM CROP AS c " +
      "INNER JOIN POND AS p ON p.ID = ? " +
      "WHERE c.pondID = p.ID );";

    //Delete daily history
    sql +=
      "DELETE FROM DAILY_HISTORY " +
      "WHERE DAILY_HISTORY.cropID IN " +
      "( SELECT c.ID FROM CROP AS c " +
      "INNER JOIN POND AS p ON p.ID = ? " +
      "WHERE c.pondID = p.ID );";

    //Delete crops and pond
    sql +=
      "DELETE FROM CROP WHERE CROP.pondID = ?;" +
      "DELETE FROM POND WHERE POND.ID = ?;";

    id &&
      connection.query(sql, [id, id, id, id], (err, results) => {
        if (err) {
          res.status(400).json("Cannot delete this pond!");
        } else {
          res.status(200).json(results);
        }
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
