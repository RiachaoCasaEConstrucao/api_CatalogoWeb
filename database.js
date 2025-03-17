const mysql = require('mysql2');

// Criação do pool de conexões
const pool = mysql.createPool({
  host: 'switchback.proxy.rlwy.net', 
  user: 'root',
  password: 'UhTdjjlIwlzTUJlyQdgJWfORmEKuBlkO',
  database: 'railway',
  port: '33881',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});


// Promisify para usar async/await
const promisePool = pool.promise();

module.exports = promisePool;
