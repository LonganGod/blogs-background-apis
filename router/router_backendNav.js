const express = require('express');
const router_backendNav = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');

router_backendNav
// 获取数据
  .get('/api/backend/getBackendNavList', (req, res) => {
    let sql = `select * from backendNav where navPId = 0 and type = 1 order by navIndex`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from backendNav where navPId = ? and type = 1 order by navIndex`
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
  // 获取权限数据
  .get('/api/backend/getPermissionListData', (req, res) => {
    let sql = `select * from backendnav where navPId = ? and type = 0`;
    conn.query(sql, req.query.id, (err, result) => {
      if (err) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      return res.send({code: 200, message: '数据获取成功', result: result});
    })
  })
  // 编辑权限
  .post('/api/backend/editPermission', (req, res) => {
    let pId = parseInt(req.body.navId)
    let newList = req.body.permissionList
    let oldList = []
    let updateList = []
    let insertList = []
    let deleteList = []

    let sql1 = `select * from backendnav where navPId = ?`
    let sql2 = `update backendnav set ? where navId = ?`
    let sql3 = `insert into backendnav set ?`
    let sql4 = `delete from backendnav where navId = ?`

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
          if (oldList[i].navId == newList[j].navId) {
            updateList.push(newList[j])
          }
        }
      }
      for (let i = 0; i < oldList.length; i++) {
        let num = 0
        for (let j = 0; j < updateList.length; j++) {
          if (oldList[i].navId == updateList[j].navId) {
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
          if (newList[i].navId == updateList[j].navId) {
            num++
          }
        }
        if (num == 0) {
          insertList.push(newList[i])
        }
      }

      for (uIndex = 0; uIndex < updateList.length; uIndex++) {
        let data = {
          navName: updateList[uIndex].navName,
          navJumpPage: updateList[uIndex].navJumpPage,
          navPId: updateList[uIndex].navPId
        }
        conn.query(sql2, [data, updateList[uIndex].navId], (err2, result2) => {
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
          navName: insertList[iIndex].navName,
          navJumpPage: insertList[iIndex].navJumpPage,
          navPId: pId,
          type: 0,
          navIndex: 1,
          navStatus: 1,
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
        conn.query(sql4, [deleteList[dIndex].navId], (err4, result4) => {
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

module.exports = router_backendNav;