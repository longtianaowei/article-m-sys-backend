const path = require('path')
const db = require('../db/index')
exports.addArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面不能为空')
  const articleInfo = {
    // 标题 内容 状态 所属分类ID
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename),
    // 发布时间
    pub_date: new Date(),
    // 作者ID
    author_id: req.user.id
  }
  const sql = 'insert into articles set ?'
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布文章失败')
    res.cc('发布文章成功', 0)
  })
}

exports.deleteArticleById = (req, res) => {
  const id = parseInt(req.query.id)
  const sql = `update articles set is_delete=1 where id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章失败')
    res.cc('删除文章成功', 0)
  })
}

exports.getArticleList = (req, res) => {
  const page = parseInt(req.query.pagenum) || 1 // 当前页码，默认为第一页
  const limit = parseInt(req.query.pagesize) || 10 // 每页显示数量，默认为10条
  const offset = (page - 1) * limit // 计算偏移量

  let condition = 'WHERE a.is_delete = 0 AND a.author_id = ?'
  let params = [req.user.id]

  // 如果选择了分类
  if (req.query.cate_id) {
    condition += ' AND a.cate_id = ?'
    params.push(req.query.cate_id)
  }

  // 如果选择了状态
  if (req.query.state) {
    condition += ' AND a.state = ?'
    params.push(req.query.state)
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM articles a
    ${condition}
  `

  db.query(countSql, params, (err, countResults) => {
    if (err) return res.cc(err)
    const total = countResults[0].total

    const sql = `
      SELECT a.*, c.name
      FROM articles a
      JOIN article_cate c ON a.cate_id = c.id
      ${condition}
      LIMIT ? OFFSET ?
    `

    params.push(limit, offset)

    db.query(sql, params, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        code: 0,
        message: '获取文章列表成功',
        total,
        data: results
      })
    })
  })
}

exports.getArticleById = (req, res) => {
  const sql = `select * from articles where id=?`
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章失败')
    res.send({
      code: 0,
      message: '获取文章成功',
      data: results[0]
    })
  })
}

exports.updateArticleById = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面不能为空')
  const articleInfo = {
    title: req.body.title,
    content: req.body.content,
    state: req.body.state,
    // 作者ID
    author_id: req.user.id,
    cover_img: path.join('/uploads', req.file.filename),
    // 发布时间
    pub_date: new Date()
  }
  const sql = 'update articles set ? where id=?'
  db.query(sql, [articleInfo, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章失败')
    res.cc('更新文章成功', 0)
  })
}
