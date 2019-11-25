const mysql = require('mysql');
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '00000000',
    database: 'wsbk',
    multipleStatements: true
});
conn.connect();
module.exports = conn;