const db = require('../db/index')
exports.getUserInfo = (req, res) => {
  const sql = `select id, username, nickname, email, user_pic from user where id=?`
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      code: 0,
      message: '获取用户基本信息成功!',
      data: results[0]
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  const sql = `update user set ? where id=?`
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    // 执行sql语句成功，单影响的行数不为1
    if (results.affectedRows !== 1) return res.cc('更新用户信息失败')
    return res.cc('更新用户信息成功', 0)
  })
}

exports.updataPassword = (req, res) => {
  const sql = `select * from user where id=?`
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在')
    const bcrypt = require('bcryptjs')
    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.old_pwd, results[0].password)
    if (!compareResult) return res.cc('原密码错误')
    const sql = `update user set password=? where id=?`
    const newPwd = bcrypt.hashSync(req.body.new_pwd, 10)
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败')
      return res.cc('更新密码成功', 0)
    })
  })
}

exports.updateAvatar = (req, res) => {
  const sql = `update user set user_pic=? where id=?`
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新头像失败')
    return res.cc('更新头像成功', 0)
  })
}