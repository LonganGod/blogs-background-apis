const express = require('express');
const router_public = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(routerPath, '../serverImage'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({storage: storage});

router_public
// 获取数据
  .get('/api/public/getBackendNavList', (req, res) => {
    let sql = `select * from backendNav where navPId = 0 and navStatus = 1 and type = 1 order by navIndex`;
    let sql2 = `select * from backendNav where navPId = ? and navStatus = 1 and type = 1 order by navIndex`;
    let sql3 = `select * from backendNav where navPId = ? and type = 0`;

    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      for (let i = 0; i < result.length; i++) {
        result[i].children = []
        conn.query(sql2, [result[i].navId], (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
          }

          for (let j = 0; j < result2.length; j++) {
            result2[j].children = []
            result2[j].navIndex = result[i].navIndex + '-' + result2[j].navIndex
            conn.query(sql3, [result2[j].navId], (err3, result3) => {
              for (let k = 0; k < result3.length; k++) {
                result3[k].children = []
              }
              if (err3) {
                console.log(err3);
                return res.send({code: 201, message: '数据获取失败'});
              }
              result2[j].children = result3
              if (j == result2.length - 1) {
                result[i].children = result2
              }
              if (i == result.length - 1 && j == result2.length - 1) {
                return res.send({code: 200, message: '数据获取成功', result: result});
              }
            })
          }
        })
      }
    })
  })
  // 获取数据
  .get('/api/public/getAdminData', (req, res) => {
    let sql = `select ai.adminName, ai.adminIcon, r.rolePermissions from adminInfo ai, role r where ai.adminId = ? and ai.adminRole = r.roleId`;
    conn.query(sql, [req.query.id], (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }
      return res.send({code: 200, message: '数据获取成功', result: result[0]});
    })
  })
  // 商品图片上传
  .post('/api/imgUploads', upload.single('articleImg'), (req, res) => {
    console.log(req.file)
    res.send({code: 200, message: "上传成功", filename: req.file.filename, path: serverPath + req.file.filename});
  })
  // 登录
  .post('/api/checkLogin', (req, res) => {
    let sql = `select * from admin a, adminInfo ai where a.adminId = ai.adminId and a.adminUserName = ? and a.adminPassword = ?`
    conn.query(sql, [req.body.userName, req.body.password], (err, result) => {
      if (err || result.length != 1) {
        console.log(err)
        return res.send({code: 201, message: '登录失败'})
      }
      return res.send({code: 200, message: '登录成功', result: result[0]})
    })
  })

module.exports = router_public;