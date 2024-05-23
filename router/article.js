const express = require('express')
const router = express.Router()
// 导入解析 formdata 格式表单数据的包 const multer = require('multer') // 导入处理路径的核心模块
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })
const article_handler = require('../router_handler/article')
const expressJoi = require('@escook/express-joi')
const {add_article_schema} = require('../schema/article')

// 添加文章路由
router.post('/add', upload.single('cover_img'),expressJoi(add_article_schema),article_handler.addArticle)

// 删除文章路由
router.delete('/info',article_handler.deleteArticleById)

// 获取文章列表路由
router.get('/list',article_handler.getArticleList)

// 获取文章详情路由
router.get('/info',article_handler.getArticleById)

// 修改文章路由
router.put('/info',upload.single('cover_img'),article_handler.updateArticleById)
module.exports = router