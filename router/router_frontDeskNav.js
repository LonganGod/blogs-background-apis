const express = require('express');
const router_backendNav = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_backendNav
// 获取数据
  .get('/api/frontDesk/getFrontDeskNavList', (req, res) => {
    let sql = `select * from frontdesknav order by navIndex`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from articlecate where cateId = ?`
      for (let i = 0; i < result.length; i++) {
        conn.query(sql2, [result[i].cateId], (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
          }

          if (result2.length == 0) {
            result[i].cateName = ''
          } else {
            result[i].cateName = result2[0].cateName
          }

          if (i == result.length - 1) {
            let newResult = []
            let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)
            for (let i = startIndex; i < result.length; i++) {
              if (newResult.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
                newResult.push(result[i])
              }
            }

            return res.send({code: 200, message: '数据获取成功', result: newResult, totalPage: result.length});
          }
        })
      }
    })
  })
  // 添加导航
  .post('/api/frontDesk/addFrontDeskNav', (req, res) => {
    let sql = `insert into frontdesknav set ?`;
    let data = {
      navName: req.body.navName,
      navPath: req.body.navPath,
      cateId: parseInt(req.body.cateId),
      navIndex: parseInt(req.body.navIndex),
      navStatus: req.body.navStatus ? 1 : 0,
      createTime: new Date()
    }
    conn.query(sql, data, (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 获取导航详细数据
  .get('/api/frontDesk/getFrontDeskNavData', (req, res) => {
    let sql = `select * from frontdesknav where navId = ?`;
    let sql1 = `select cateId, catePId from articlecate where cateId = ?`
    conn.query(sql, req.query.navId, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      if (result[0].cateId) {
        conn.query(sql1, result[0].cateId, (err1, result1) => {
          if (err1) {
            console.log(err1)
            return res.send({code: 201, message: '数据获取失败'})
          }
          result[0].cateId = [result1[0].catePId, result1[0].cateId]

          return res.send({code: 200, message: '数据获取成功', result: result[0]});
        })
      } else {
        return res.send({code: 200, message: '数据获取成功', result: result[0]});
      }
    })
  })
  // 编辑导航
  .post('/api/frontDesk/editFrontDeskNav', (req, res) => {
    let sql = `update frontdesknav set ? where navId = ?`;
    let data = {
      navName: req.body.navName,
      navPath: req.body.navPath,
      cateId: parseInt(req.body.cateId),
      navIndex: parseInt(req.body.navIndex),
      navStatus: req.body.navStatus ? 1 : 0
    }
    conn.query(sql, [data, parseInt(req.body.navId)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 删除数据
  .get('/api/frontDesk/deleteFrontDeskNav', (req, res) => {
    let sql = 'delete from frontdesknav where navId = ?';
    conn.query(sql, parseInt(req.query.navId), (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 停用数据
  .get('/api/frontDesk/changeFrontDeskNavStatus', (req, res) => {
    let sql = 'update frontdesknav set navStatus = ? where navId = ?';
    conn.query(sql, [parseInt(req.query.status), parseInt(req.query.navId)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })

module.exports = router_backendNav;