const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
});

module.exports = connection;
