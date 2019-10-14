const express = require('express');
const router_userMsg = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_userMsg
// 获取父级用户留言
  .get('/api/userMsg/getLeaveMsgData', (req, res) => {
    let sql = `select lm.*, ui1.nickName, ui2.nickName as respondTo1
      from leaveMsg as lm, userInfo as ui1, userInfo as ui2
      where lm.userId = ui1.userId and ui1.status = 1 and lm.respondTo = ui2.userId
      order by lm.msgId desc`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let newResult = []
      for (let i = 0; i < result.length; i++) {
        if (result[i].msgPId == 0) {
          let obj = result[i]
          obj.reply = []
          newResult.push(obj)
        }
      }

      for (let i = 0; i < newResult.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (result[j].msgPId != 0 && result[j].msgPId == newResult[i].msgId) {
            let obj = result[j]
            newResult[i].reply.push(obj)
          }
        }
      }

      let result1 = []
      let startIndex = (Number(req.query.currentPage) - 1) * Number(req.query.pageList)
      for (let i = startIndex; i < newResult.length; i++) {
        if (result1.length < Number(req.query.pageList) * Number(req.query.currentPage)) {
          result1.push(newResult[i])
        }
      }
      res.send({code: 200, message: '数据获取成功', result: result1, totalPage: newResult.length});
    });
  })

  // 获取总用户留言数
  .get('/api/userMsg/getUserMsgTotalList', (req, res) => {
    let sql = 'select count(*) as length from leaveMsg userInfo where userInfo.userId = leaveMsg.userId and userInfo.status = 1 and leaveMsg.msgPId = 0';
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      res.send({code: 200, message: '数据获取成功', result: result[0]});
    });
  })

  // 删除留言
  .get('/api/userMsg/deleteMsg', (req, res) => {
    let sql = `delete from leaveMsg where leaveMsg.msgId = ?`;
    conn.query(sql, [Number(req.query.msgId)], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err);
        return res.send({code: 201, message: '操作失败'});
      }
      res.send({code: 200, message: '操作成功'});
    });
  })
module.exports = router_userMsg;