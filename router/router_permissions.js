const express = require('express');
const router_permissions = express.Router();

const path = require('path');
const conn = require('../tools/db');

router_permissions
// 获取数据
  .get('/api/permission/getPermissionList', (req, res) => {
    let sql = `select * from permissions where permissionsPId = 0`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from permissions where permissionsPId = ?`
      for (let i = 0; i < result.length; i++) {
        conn.query(sql2, [result[i].permissionsId], (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
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

module.exports = router_permissions;