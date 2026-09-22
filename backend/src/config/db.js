const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_HOST || 'root',
    password : process.env.DB_PASSWORD || 'info2k26',
    database : process.env.DB_NAME || 'todo_db',
    waitForConnections : true,
    connectionLimit : 10
});

module.exports = pool;