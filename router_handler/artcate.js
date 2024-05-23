const db = require('../db/index')
exports.getArticleCates = (req, res) => {
  const sql = `select * from article_cate where is_delete=0 order by id asc`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 0) {
      return res.send({
        code: 0,
        message: '获取文章分类列表成功！',
        data: results
      })
    } else {
      return res.cc('获取文章分类列表失败！')
    }
  })
}

// 添加文章分类
exports.addArticleCates = (req, res) => {
  const sqlCheck = `select * from article_cate where name=? or alias=?`
  db.query(sqlCheck, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)

    const existingCate = results.find(cate => cate.is_delete === 1)
    if (existingCate) {
      // 如果分类名和分类别名跟之前软删除的记录都重复了，则更新is_delete=0
      if (existingCate.name === req.body.name && existingCate.alias === req.body.alias) {
        const sqlUpdate = `update article_cate set is_delete=0 where id=?`
        db.query(sqlUpdate, existingCate.id, (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows !== 1) return res.cc('添加文章分类失败！')
          res.cc('添加文章分类成功！', 0)
        })
      } else if (existingCate.name === req.body.name) {
        // 如果只是分类名跟之前软删除的记录重复了，则更新is_delete=0并设置分类别名为新的分类别名
        const sqlUpdate = `update article_cate set alias=?, is_delete=0 where id=?`
        db.query(sqlUpdate, [req.body.alias, existingCate.id], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows !== 1) return res.cc('添加文章分类失败！')
          res.cc('添加文章分类成功！', 0)
        })
      }
    } else {
      // 其他情况直接插入新的一条分类
      const sqlInsert = `insert into article_cate set ?`
      db.query(sqlInsert, req.body, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加文章分类失败！')
        res.cc('添加文章分类成功！', 0)
      })
    }
  })
}


exports.deleteCateById = (req, res) => {
  const id = parseInt(req.query.id); // 将字符串转换为数字
  const sql = `update article_cate set is_delete=1 where id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
    res.cc('删除文章分类成功！', 0)
  })
}

exports.getCateById = (req, res) => {
  const sql = `select * from article_cate where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章分类失败！')
    res.send({
      code: 0,
      message: '获取文章分类成功！',
      data: results[0]
    })
  })
}


exports.updateCateById = (req, res) => {
  const sql = `select * from article_cate where id!=? and (name=? or alias=?)`
  db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) {
      res.cc('分类名称被占用，请更换后重试！')
    }
    if (results.length === 1 && results[0].alias === req.body.alias) {
      res.cc('分类别名被占用，请更换后重试！')
    }
    const sql = `update article_cate set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      res.cc('更新文章分类成功！', 0)
    })
  })
}
