const express = require('express');
const router_backendNav = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_backendNav
// 获取数据
  .get('/api/backend/getBackendNavList', (req, res) => {
    let sql = `select * from backendNav where navPId = 0 order by navIndex`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from backendNav where navPId = ? order by navIndex`
      for (let i = 0; i < result.length; i++) {
        conn.query(sql2, [result[i].navId], (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
          }

          for (let j = 0; j < result2.length; j++) {
            result2[j].navIndex = result[i].navIndex + '-' + result2[j].navIndex
          }

          result[i].children = result2
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
  .post('/api/backend/addBackendNav', (req, res) => {
    let sql = `insert into backendnav set ?`;
    let data = {
      navName: req.body.navName,
      navIcon: req.body.navIcon,
      navJumpPage: req.body.navUrl,
      navPId: parseInt(req.body.parentNavName),
      navIndex: parseInt(req.body.parentNavName) + '-' + parseInt(req.body.navPosition),
      navStatus: req.body.navState ? 1 : 2,
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
  // 编辑导航
  .post('/api/backend/editBackendNav', (req, res) => {
    let sql = `update backendnav set ? where navId = ?`;
    let data = {
      navName: req.body.navName,
      navIcon: req.body.navIcon,
      navJumpPage: req.body.navUrl,
      navPId: parseInt(req.body.parentNavName),
      navIndex: parseInt(req.body.navPosition),
      navStatus: req.body.navState ? 1 : 2,
      createTime: new Date()
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
  .get('/api/backend/deleteBackendNav', (req, res) => {
    let sql = 'delete from backendnav where navId = ?';
    conn.query(sql, parseInt(req.query.navId), (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 停用数据
  .get('/api/backend/disableBackendNav', (req, res) => {
    let sql = 'update backendnav set navStatus = 2 where navId = ?';
    conn.query(sql, [parseInt(req.query.navId), parseInt(req.query.navId)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 启用数据
  .get('/api/backend/enableBackendNav', (req, res) => {
    let sql = `update backendnav set navStatus = 1 where navId = ?`;
    conn.query(sql, req.query.navId, (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 获取第一级导航
  .get('/api/backend/getFirBackendNavList', (req, res) => {
    let sql = `select navId, navName from backendNav where navPId = 0 order by navIndex`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 获取导航详细数据
  .get('/api/backend/getBackendNav', (req, res) => {
    let sql = `select * from backendNav where navId = ?`;
    conn.query(sql, req.query.navId, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result[0]});
    })
  })

module.exports = router_backendNav;