const express = require('express');
const router_userList = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_userList
// 获取用户信息列表
  .get('/api/userList/getUserData', (req, res) => {
    let sql = 'select * from user, userInfo where user.userId = userInfo.userId and user.userId > ? and userInfo.status = 1 limit ?';
    conn.query(sql, [Number(req.query.startId), Number(req.query.pageList)], (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result});
    });
  })

  // 获取本页最后一条记录Id
  .get('/api/userList/getLastDataId', (req, res) => {
    let sql = 'select userId from userInfo where status = 1 limit ?';
    conn.query(sql, [Number(req.query.prevListNum)], (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[result.length - 1].userId});
    });
  })

  // 获取总用户信息数
  .get('/api/userList/getUserTotalList', (req, res) => {
    let sql = 'select count(*) as length from userInfo where status = 1';
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[0]});
    });
  })

  // 查看用户详细信息
  .get('/api/userList/showUserDetail', (req, res) => {
    let sql = 'select * from user, userInfo where user.userId = userInfo.userId and userInfo.userId = ?';
    conn.query(sql, [Number(req.query.userId)], (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[0]});
    });
  })

  // 删除用户
  .get('/api/userList/deleteUser', (req, res) => {
    let sql = `update userInfo set userInfo.status = 2 where userInfo.userId = ?`;
    conn.query(sql, [Number(req.query.userId)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[0]});
    });
  })

module.exports = router_userList;