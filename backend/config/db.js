const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

let mode = 'UNKNOWN'; // 'MYSQL' or 'SQLITE'
let mysqlPool = null;
let sqliteDb = null;

async function initDbConnection() {
  if (mode !== 'UNKNOWN') return;

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'dearthreado_db',
    waitForConnections: true,
    connectionLimit: 10
  };

  try {
    const sysConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await sysConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await sysConn.end();

    mysqlPool = mysql.createPool(dbConfig);
    const conn = await mysqlPool.getConnection();
    conn.release();
    mode = 'MYSQL';
    console.log('✅ Connected to MySQL Database:', dbConfig.database);
  } catch (err) {
    console.warn('⚠️ MySQL connection failed (' + err.message + '). Using local SQLite database engine.');
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'dearthreado.sqlite');
    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    await sqliteDb.exec('PRAGMA foreign_keys = ON;');
    mode = 'SQLITE';
    console.log('✅ Connected to SQLite Database at:', dbPath);
  }
}

async function query(sql, params = []) {
  await initDbConnection();

  if (mode === 'MYSQL') {
    const [results] = await mysqlPool.execute(sql, params);
    return results;
  } else {
    // Translate SQL for SQLite
    let translatedSql = sql
      .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/ENGINE=InnoDB/gi, '')
      .replace(/DEFAULT CHARSET=\w+/gi, '')
      .replace(/TINYINT\(1\)/gi, 'INTEGER')
      .replace(/JSON/gi, 'TEXT');

    const trimmed = sql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('SHOW')) {
      const rows = await sqliteDb.all(translatedSql, params);
      return rows;
    } else if (trimmed.startsWith('INSERT')) {
      const result = await sqliteDb.run(translatedSql, params);
      return { insertId: result.lastID, affectedRows: result.changes };
    } else {
      const result = await sqliteDb.run(translatedSql, params);
      return { affectedRows: result.changes };
    }
  }
}

async function getPool() {
  await initDbConnection();
  return {
    query,
    execute: query
  };
}

module.exports = {
  getPool,
  query,
  initDbConnection
};
