const mysql = require('mysql2/promise');

// setup connection to mysql
const connection = mysql.createPool({
    host: 'localhost',
    database: 'employee_tracker',
    user: 'root',
    password: 'Lightsaber11@@'
});

module.exports = connection;