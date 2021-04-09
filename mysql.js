const mysql = require('mysql2');

// var connection = mysql.createConnection({
var pool = mysql.createPool({
    "user": process.env.MYSL_USER,
    "password": process.env.MYSL_PASSWORD,
    "database": process.env.MYSL_DATABASE,
    "host": process.env.MYSL_HOST,
    "port": process.env.MYSL_PORT
});

exports.pool = pool;