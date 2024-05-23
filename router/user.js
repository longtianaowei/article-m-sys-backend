const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const userHandler = require('../router_handler/user')
const {register_schema,login_schema} = require('../schema/user')
// 注册
router.post('/reg',expressJoi(register_schema),userHandler.register)

// 登陆
router.post('/login',expressJoi(login_schema),userHandler.login)

// 导出 将路由对象共享出去
module.exports = router