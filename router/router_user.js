const express = require('express');
const router_user = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_user
// 获取用户信息列表
  .get('/user/getUserData', (req, res) => {
    let sql = 'select * from user, userInfo where user.userId = userInfo.userId';
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result});
    });
  })

module.exports = router_user;