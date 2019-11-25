const express = require('express');
const router_permissions = express.Router();

const path = require('path');
const conn = require('../tools/db');

router_permissions
// 获取数据
  .get('/api/permission/getPermissionList', (req, res) => {
    let sql = `select * from permissions where permissionsPId = 0 and type = 1`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from permissions where permissionsPId = ? and type = 1`
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
  // 获取第一级导航
  .get('/api/permission/getFirPermissionList', (req, res) => {
    let sql = `select permissionsId, permissionsName from permissions where permissionsPId = 0`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 添加导航
  .post('/api/permission/addPermissionCate', (req, res) => {
    let sql = `insert into permissions set ?`;
    let data = {
      permissionsName: req.body.permissionsName,
      permissionsUrl: req.body.permissionsUrl,
      permissionsPId: parseInt(req.body.permissionsPId),
      type: req.body.type,
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
  // 删除导航
  .get('/api/permission/deletePermissionCate', (req, res) => {
    let sql = 'delete from permissions where permissionsId = ?;delete from permissions where permissionsPId = ?';
    conn.query(sql, [parseInt(req.query.id), parseInt(req.query.id)], (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 获取数据
  .get('/api/permission/getPermissionData', (req, res) => {
    let sql = `select * from permissions where permissionsId = ?`;
    conn.query(sql, req.query.id, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      return res.send({code: 200, message: '数据获取成功', result: result[0]});
    })
  })
  // 编辑导航
  .post('/api/permission/editPermissionCate', (req, res) => {
    let sql = `update permissions permissions set ? where permissionsId = ?`;
    let data = {
      permissionsName: req.body.permissionsName,
      permissionsUrl: req.body.permissionsUrl,
      permissionsPId: parseInt(req.body.permissionsPId)
    }
    conn.query(sql, [data, req.body.permissionsId], (err, result) => {
      if (err || result.affectedRows != 1) {
        console.log(err)
        return res.send({code: 201, msg: '操作失败'})
      }
      return res.send({code: 200, msg: '操作成功'})
    })
  })
  // 获取权限数据
  .get('/api/permission/getPermissionListData', (req, res) => {
    let sql = `select * from permissions where permissionsPId = ?`;
    conn.query(sql, req.query.id, (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })

module.exports = router_permissions;