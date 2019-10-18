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
      if (err || result.length == 0) {
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
    let sql = 'delete from articlecate where cateId = ?'
    conn.query(sql, parseInt(req.query.id), (err, result) => {
      if (err || result.affectedRows != 1) {
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
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
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

module.exports = router_article;