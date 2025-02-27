var mysql = require('mysql2');
const encryptdecrypt = require('./encryptdecrypt');

/* Decrypt Database Details */
const DBHost = process.env.DBHost;
const DBUser = encryptdecrypt.decrypt(process.env.DBUser);
const DBPassword = encryptdecrypt.decrypt(process.env.DBPassword);
const DBName = encryptdecrypt.decrypt(process.env.DBName);

// var conn = mysql.createConnection({
//   host: DBHost,
//   user: DBUser,
//   port: 3306,
//   password: DBPassword,
//   database: DBName
// });

// conn.connect(function(err) {
//   if(err){
//     console.log("💥💥💥",err);
//     return res.status(400).json({ status: false, message: err.sqlMessage });
//   }
//   console.log('Database is connected successfully !');
// });

// module.exports = conn;


var pool = mysql.createPool({
  connectionLimit:4,
  host: DBHost,
  user: DBUser,
  port: 3306,
  password: DBPassword,
  database: DBName
});

pool.getConnection((err,connection)=> {
  if(err){
    console.log(err);
    return res.status(400).json({ status: false, message: err.sqlMessage });
  }
  console.log('Database is connected successfully !');
  connection.release();
});

module.exports = pool;
