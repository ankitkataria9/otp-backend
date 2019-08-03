const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.dbname,
  debug: false
})

exports.getConnection = (callback) => {
  pool.getConnection((err, connection) => {
    callback(err, connection);
  });


}