const express = require('express')
const router = express.Router()
const userinfo_handler = require('../router_handler/userinfo')
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要验证的规则对象
const {
  update_userinfo_schema,
  update_password_schema,
  update_avatar_schema
} = require('../schema/user')

// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户的基本信息的路由
router.put('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 重置密码的路由
router.patch('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updataPassword)
// 更新用户头像的路由
router.patch('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router
