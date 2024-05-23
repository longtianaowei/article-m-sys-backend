const mysql = require('mysql2')

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'数据库名',
    password: '数据库密码',
    database: '数据库名'
})

module.exports = db
