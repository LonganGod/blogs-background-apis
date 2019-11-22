const express = require('express');
const router_role = express.Router();

const path = require('path');
const conn = require('../tools/db');

router_role
// 获取数据
  .get('/api/role/getRoleList', (req, res) => {
    let sql = `select * from role where rolePId = 0`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from role where rolePId = ?`;
      for (let i = 0; i < result.length; i++) {
        conn.query(sql2, [result[i].roleId], (err2, result2) => {
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
  // 获取父级角色数据
  .get('/api/role/getFirRoleList', (req, res) => {
    let sql = `select * from role where rolePId = 0`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 获取权限数据
  .get('/api/role/getPermissionsList', (req, res) => {
    let sql = `select * from permissions`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 新增角色
  .post('/api/role/addRole', (req, res) => {
    let sql = `insert into role set ?`
    let data = {
      roleName: req.body.roleName,
      rolePId: parseInt(req.body.rolePId),
      rolePermissions: req.body.permissionsIds,
      createTime: new Date()
    }
    conn.query(sql, data, (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'});
      }
      return res.send({code: 200, message: '操作成功', result: result});
    })
  })
  // 编辑角色
  .get('/api/role/getRoleData', (req, res) => {
    let sql = `select * from role where roleId = ?`
    conn.query(sql, req.query.roleId, (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '获取数据失败'});
      }
      return res.send({code: 200, message: '获取数据成功', result: result[0]});
    })
  })
  // 保存编辑
  .post('/api/role/editRole', (req, res) => {
    let sql = `update role set ? where roleId = ?;`
    let data = {
      roleName: req.body.roleName,
      rolePId: parseInt(req.body.rolePId),
      rolePermissions: req.body.permissionsIds
    }
    conn.query(sql, [data, req.body.roleId, data, req.body.roleId], (err, result) => {
      if (err) {
        console.log(err)
        return res.send({code: 201, message: '操作失败'});
      }
      return res.send({code: 200, message: '操作成功', result: result});
    })
  })

module.exports = router_role;