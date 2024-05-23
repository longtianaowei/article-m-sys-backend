// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()
const joi = require('joi')

// 增加请求体大小限制为5MB
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '5mb' }))
// 解决跨域中间件
const cors = require('cors')
app.use(cors())
app.use('/uploads',express.static('./uploads'))

// 一定要在路由之前，封装 res.cc 函数
app.use(function (req, res, next) {
  res.cc = function (err, code = 1) {
    res.send({
      code,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})


const config = require('./config')

const expressJWT = require('express-jwt')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
const artCateRouter = require('./router/artcate')
app.use('/my/cate',artCateRouter)
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！',401)
  // 未知的错误
  res.cc('未知错误')
})

app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})