const mysql = require('mysql2/promise');
require("dotenv").config();

async function connectDB() {

    const db = await mysql.createPool({
        host: '127.0.0.1',
        port:3306,
        user: 'root',
        password: process.env.VITE_DB_PASSWORD,
        database: 'recycle'
      });

    console.log('Connected to MySQL');

    return db;

}

module.exports = connectDB;
