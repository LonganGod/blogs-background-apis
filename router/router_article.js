const express = require('express');
const router_article = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_article
// 获取一级分类数据
  .get('/api/article/getFirCateList', (req, res) => {
    let sql = `select * from articlecate where catePId = 0 order by cateId desc`;
    conn.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let newResult = []
      let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)
      for (let i = startIndex; i < result.length; i++) {
        if (newResult.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
          newResult.push(result[i])
        }
      }

      return res.send({code: 200, message: '数据获取成功', result: newResult, totalPage: result.length});
    })
  })
  // 新增一级分类
  .post('/api/article/addFirCate', (req, res) => {
    let sql = 'insert into articlecate set ?'
    let data = {
      cateName: req.body.cateName,
      catePId: 0,
      catestatus: 1,
      createTime: new Date()
    }

    conn.query(sql, data, (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '获取数据失败'})
      }
      return res.send({code: 200, message: '获取数据成功', result: result})
    })
  })
  // 修改一级分类状态
  .get('/api/article/changeFirCateStatus', (req, res) => {
    let sql = 'update articlecate set cateStatus = ? where cateId = ?'
    conn.query(sql, [parseInt(req.query.status), parseInt(req.query.id)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 删除一级分类
  .get('/api/article/deleteFirCate', (req, res) => {
    let sql = 'delete from articlecate where cateId = ? or catePId = ?'
    conn.query(sql, [parseInt(req.query.id), parseInt(req.query.id)], (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 编辑一级分类
  .get('/api/article/getFirCateData', (req, res) => {
    let sql = 'select * from articlecate where cateId = ?'
    conn.query(sql, parseInt(req.query.id), (err, result) => {
      if (err || result.length != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功', result: result[0]})
    })
  })
  // 保存编辑一级分类
  .post('/api/article/editFirCateData', (req, res) => {
    let sql = 'update articlecate set cateName = ? where cateId = ?'
    conn.query(sql, [req.body.formData.cateName, req.body.cateId], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 获取二级分类数据
  .get('/api/article/getSecCateList', (req, res) => {
    let sql = `select * from articlecate where catePId = ? order by cateId desc`;
    conn.query(sql, parseInt(req.query.catePId), (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let newResult = []
      let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)
      for (let i = startIndex; i < result.length; i++) {
        if (newResult.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
          newResult.push(result[i])
        }
      }

      return res.send({code: 200, message: '数据获取成功', result: newResult, totalPage: result.length});
    })
  })
  // 新增二级分类
  .post('/api/article/addSecCate', (req, res) => {
    let sql = 'insert into articlecate set ?'
    let data = {
      cateName: req.body.cateName,
      catePId: req.body.catePId,
      catestatus: 1,
      createTime: new Date()
    }

    conn.query(sql, data, (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '获取数据失败'})
      }
      return res.send({code: 200, message: '获取数据成功', result: result})
    })
  })
  // 编辑二级分类
  .get('/api/article/getSecCateData', (req, res) => {
    let sql = 'select sec.*, fir.cateName as firCN from articlecate as fir, articlecate as sec where sec.cateId = ? and sec.catePId = fir.cateId'
    conn.query(sql, parseInt(req.query.id), (err, result) => {
      if (err || result.length != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功', result: result[0]})
    })
  })
  // 删除二级分类
  .get('/api/article/deleteSecCate', (req, res) => {
    let sql = 'delete from articlecate where cateId = ?'
    conn.query(sql, parseInt(req.query.id), (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 新增文章页面获取类别
  .get('/api/article/articlePageGetCate', (req, res) => {
    let sql1 = `select * from articlecate where catePId = 0 order by cateId desc`;

    conn.query(sql1, (err1, result1) => {
      if (err1) {
        console.log(err1);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from articlecate where catePId = ? order by cateId desc`;
      for (let i = 0; i < result1.length; i++) {
        result1[i].children = []
        conn.query(sql2, result1[i].cateId, (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
          }
          result1[i].children = result2

          if (i == result1.length - 1) {
            return res.send({code: 200, message: '数据获取成功', result: result1});
          }
        })
      }
    })
  })
  // 新增文章页面获取标签
  .get('/api/article/articlePageGetLabel', (req, res) => {
    var ids = req.query.labelIds != undefined ? req.query.labelIds : 0
    let sql1 = `select * from labels where labelId not in (${ids}) order by labelId desc`;

    conn.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 新增保存文章
  .post('/api/article/addArticle', (req, res) => {
    let sql1 = `insert into article set ?`;
    let data = {
      articleTitle: req.body.articleTitle,
      articleCate: req.body.articleCate,
      articleLabel: req.body.articleLabel.join(','),
      articleImg: req.body.articleImg.join(','),
      articleContent: req.body.articleContent,
      status: req.body.status,
      createTime: new Date()
    }

    conn.query(sql1, data, (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 获取文章
  .get('/api/article/getArticleList', (req, res) => {
    let sql = 'select a.*, ac.cateName from article a, articlecate ac where ac.cateId = a.articleCate order by a.articleId desc'
    conn.query(sql, (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '数据获取失败'})
      }

      let newResult = []
      let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)
      for (let i = startIndex; i < result.length; i++) {
        result[i].index = i + 1
        if (newResult.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
          newResult.push(result[i])
        }
      }

      for (let i = 0; i < newResult.length; i++) {
        newResult[i].articleLabel = newResult[i].articleLabel.split(',')

        let sql2 = 'select l.labelId, l.labelName from labels l where l.labelId = ?'
        for (let j = 0; j < newResult[i].articleLabel.length; j++) {
          conn.query(sql2, newResult[i].articleLabel[j], (err2, result2) => {
            if (err2) {
              return console.log(err2)
            }
            newResult[i].articleLabel[j] = result2[0]

            if (i == newResult.length - 1 && j == newResult[i].articleLabel.length - 1) {
              return res.send({code: 200, message: '数据获取成功', result: newResult, totalPage: result.length});
            }
          })
        }
      }
    })
  })
  // 编辑文章
  .get('/api/article/getEditArticle', (req, res) => {
    let sql = `select * from article where articleId = ?`
    let sql1 = `select cateId, catePId from articlecate where cateId = ?`
    let sql2 = `select labelId, labelName from labels where labelId = ?`
    conn.query(sql, req.query.id, (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '数据获取失败'})
      }
      var imgsArr = result[0].articleImg.split(',')
      result[0].articleImg = []
      for (let i = 0; i < imgsArr.length; i++) {
        var obj = {}
        obj.name = 'img' + (i + 1)
        obj.url = imgsArr[i]
        result[0].articleImg.push(obj)
      }

      conn.query(sql1, result[0].articleCate, (err1, result1) => {
        if (err1) {
          console.log(err1)
          return res.send({code: 201, message: '数据获取失败'})
        }
        result[0].articleCate = [result1[0].catePId, result1[0].cateId]

        var labelArr = result[0].articleLabel.split(',')
        result[0].labelsList = []

        for (let i = 0; i < labelArr.length; i++) {
          conn.query(sql2, labelArr[i], (err2, result2) => {
            if (err2) {
              console.log(err2)
              return res.send({code: 201, message: '数据获取失败'})
            }
            result[0].labelsList.push(result2[0])
            if (i == labelArr.length - 1) {
              return res.send({code: 200, message: '数据获取成功', result: result[0]})
            }
          })
        }
      })
    })
  })
  // 编辑保存文章
  .post('/api/article/editArticle', (req, res) => {
    let sql1 = `update article set ? where articleId = ?`;
    let data = {
      articleTitle: req.body.articleTitle,
      articleCate: req.body.articleCate,
      articleLabel: req.body.articleLabel.join(','),
      articleImg: req.body.articleImg.join(','),
      articleContent: req.body.articleContent,
      status: req.body.status,
      createTime: new Date()
    }

    conn.query(sql1, [data, req.body.articleId], (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '编辑成功', result: result});
    })
  })

module.exports = router_article;