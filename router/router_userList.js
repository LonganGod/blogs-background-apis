const express = require('express');
const router_userList = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_userList
// 获取用户信息列表
  .get('/api/userList/getUserData', (req, res) => {
    console.log(req.query)
    let sql = 'select * from user, userInfo where user.userId = userInfo.userId';
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result});
    });
  })

  .get('/api/userList/totalList', (req, res) => {
    let sql = 'select count(*) as length from userInfo';
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[0]});
    });
  })

module.exports = router_userList;