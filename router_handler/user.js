const bcrypt = require('bcryptjs')
const db = require('../db/index')
const jwt = require('jsonwebtoken')
const config = require('../config')
exports.register = (req, res) => {
  // 接收用户表单数据
  const userinfo = req.body
  const sql = `select * from user where username = ?`
  db.query(sql, [userinfo.username], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    if(userinfo.password !== userinfo.repassword) {
      return res.cc('两次密码不一致')
    }
    if (results.length > 0) {
      return res.cc('用户名已被注册')
    }
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    const sql = `insert into user set ?`
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      function (err, results) {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.send('注册失败')
        }
        res.cc('注册成功',0)
      }
    )
  })
}

exports.login = (req, res) => {
  const userinfo = req.body
  const sql = `select * from user where username = ?`
  db.query(sql, userinfo.username, function(err,results) {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('登录失败')
    const compareResult = bcrypt.compareSync(userinfo.password,results[0].password) 
    if(!compareResult) {
        return res.cc('用户名或密码错误')
    }
    const user = {...results[0],password:'',user_pic: ''}
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'}) //token有效期10小时
    res.send({
        code:0,
        message:'登录成功',
        token: 'Bearer ' + tokenStr
    })
  })
}