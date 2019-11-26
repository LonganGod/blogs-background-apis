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
  // 获取第一级权限分类
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
  // 添加权限分类
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
  // 删除权限分类
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
  // 获取权限分类数据
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
  // 编辑权限分类
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
  // 编辑权限
  .post('/api/permission/editPermission', (req, res) => {
    let pId = parseInt(req.body.permissionsId)
    let newList = req.body.permissionList
    let oldList = []
    let updateList = []
    let insertList = []
    let deleteList = []

    let sql1 = `select * from permissions where permissionsPId = ?`
    let sql2 = `update permissions set ? where permissionsId = ?`
    let sql3 = `insert into permissions set ?`
    let sql4 = `delete from permissions where permissionsId = ?`

    let errNum = 0
    let uIndex, iIndex, dIndex
    let canSend = true

    conn.query(sql1, [pId], (err1, result1) => {
      if (err1) {
        console.log(err1)
        errNum++
      }
      oldList = result1

      for (let i = 0; i < oldList.length; i++) {
        for (let j = 0; j < newList.length; j++) {
          if (oldList[i].permissionsId == newList[j].permissionsId) {
            updateList.push(newList[j])
          }
        }
      }
      for (let i = 0; i < oldList.length; i++) {
        let num = 0
        for (let j = 0; j < updateList.length; j++) {
          if (oldList[i].permissionsId == updateList[j].permissionsId) {
            num++
          }
        }
        if (num == 0) {
          deleteList.push(oldList[i])
        }
      }
      for (let i = 0; i < newList.length; i++) {
        let num = 0
        for (let j = 0; j < updateList.length; j++) {
          if (newList[i].permissionsId == updateList[j].permissionsId) {
            num++
          }
        }
        if (num == 0) {
          insertList.push(newList[i])
        }
      }

      for (uIndex = 0; uIndex < updateList.length; uIndex++) {
        let data = {
          permissionsName: updateList[uIndex].permissionsName,
          permissionsUrl: updateList[uIndex].permissionsUrl,
          permissionsPId: updateList[uIndex].permissionsPId,
          type: '0',
        }
        conn.query(sql2, [data, updateList[uIndex].permissionsId], (err2, result2) => {
          if (err2) {
            errNum++
            console.log(err2)
          }
          if (
            uIndex == updateList.length &&
            iIndex == insertList.length &&
            dIndex == deleteList.length &&
            canSend
          ) {
            canSend = false
            if (errNum == 0) {
              return res.send({code: 200, message: '操作成功'})
            } else {
              return res.send({code: 201, message: '操作失败'})
            }
          }
        })
      }
      for (iIndex = 0; iIndex < insertList.length; iIndex++) {
        let data = {
          permissionsName: insertList[iIndex].permissionsName,
          permissionsUrl: insertList[iIndex].permissionsUrl,
          permissionsPId: pId,
          type: '0',
          createTime: new Date()
        }
        conn.query(sql3, [data], (err3, result3) => {
          if (err3) {
            errNum++
            console.log(err3)
          }
          if (
            uIndex == updateList.length &&
            iIndex == insertList.length &&
            dIndex == deleteList.length &&
            canSend
          ) {
            canSend = false
            if (errNum == 0) {
              return res.send({code: 200, message: '操作成功'})
            } else {
              return res.send({code: 201, message: '操作失败'})
            }
          }
        })
      }
      for (dIndex = 0; dIndex < deleteList.length; dIndex++) {
        conn.query(sql4, [deleteList[dIndex].permissionsId], (err4, result4) => {
          if (err4) {
            errNum++
            console.log(err4)
          }
          if (
            uIndex == updateList.length &&
            iIndex == insertList.length &&
            dIndex == deleteList.length &&
            canSend
          ) {
            canSend = false
            if (errNum == 0) {
              return res.send({code: 200, message: '操作成功'})
            } else {
              return res.send({code: 201, message: '操作失败'})
            }
          }
        })
      }
    })
  })

module.exports = router_permissions;