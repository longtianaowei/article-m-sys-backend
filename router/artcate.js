const express = require('express')
const router = express.Router()

const artcate_handler = require('../router_handler/artcate')
const expressJoi = require('@escook/express-joi')
const {add_cate_schema,delete_cate_schema,get_cate_schema,update_cate_schema} = require('../schema/artcate')

// 获取文章分类的列表路由
router.get('/list',artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/add',expressJoi(add_cate_schema),artcate_handler.addArticleCates)

// 删除文章分类的路由
router.delete('/del',expressJoi(delete_cate_schema),artcate_handler.deleteCateById)

// 根据 Id 获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schema),artcate_handler.getCateById)


// 根据 Id 更新文章分类的路由
router.put('/info',expressJoi(update_cate_schema),artcate_handler.updateCateById)
module.exports = router