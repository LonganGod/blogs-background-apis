const express = require('express');
const router_labels = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_labels
// 获取标签列表数据
  .get('/api/labels/getLabelsList', (req, res) => {
    let sql = `select * from labels order by labelId desc`;
    let sql1 = `select article.articleLabel from article`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      let newResult = []
      let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)

      conn.query(sql1, (err1, result1) => {
        if (err1) {
          console.log(err1);
          return res.send({code: 201, message: '数据获取失败'});
        }
        for (let i = startIndex; i < result.length; i++) {
          result[i].articles = 0
          for (let j = 0; j < result1.length; j++) {
            let labels = result1[j].articleLabel.split(',')
            for (let k = 0; k < labels.length; k++) {
              if (labels[k] == result[i].labelId) {
                result[i].articles++
              }
            }
          }
          if (newResult.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
            newResult.push(result[i])
          }
        }
        return res.send({code: 200, message: '数据获取成功', result: newResult, totalPage: result.length});
      })
    })
  })
  // 新增标签
  .post('/api/labels/addLabels', (req, res) => {
    let sql = 'insert into labels set ?'
    let params = {
      status: 1,
      labelName: req.body.labelName,
      createTime: new Date()
    }
    conn.query(sql, params, (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      res.send({code: 200, message: '操作成功'})
    })
  })
  // 修改标签状态
  .get('/api/article/changeLabelsStatus', (req, res) => {
    let sql = 'update labels set status = ? where labelId = ?'
    conn.query(sql, [parseInt(req.query.status), parseInt(req.query.id)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 删除标签
  .get('/api/article/deleteLabelsStatus', (req, res) => {
    let sql = 'delete from labels where labelId = ?'
    conn.query(sql, parseInt(req.query.id), (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      return res.send({code: 200, message: '操作成功'})
    })
  })
  // 获取标签数据
  .get('/api/labels/getLabelData', (req, res) => {
    let sql = `select * from labels where labelId = ?`;
    conn.query(sql, req.query.id, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result[0]});
    })
  })
  // 编辑标签
  .post('/api/labels/editLabels', (req, res) => {
    let sql = 'update labels set ? where labelId = ?'
    conn.query(sql, [req.body.formData, req.body.labelId], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'})
      }
      res.send({code: 200, message: '操作成功'})
    })
  })

module.exports = router_labels;