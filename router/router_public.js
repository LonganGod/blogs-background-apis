const express = require('express');
const router_public = express.Router();

const path = require('path');
const conn = require('../tools/db');
const moment = require('moment');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/myTest/Vue-houtai/src/assets/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({storage: storage});

router_public
// 获取数据
  .get('/api/public/getBackendNavList', (req, res) => {
    let sql = `select * from backendNav where navPId = 0 and navStatus = 1 order by navIndex`;
    conn.query(sql, (err, result) => {
      if (err || result.length == 0) {
        console.log(err);
        return res.send({code: 201, message: '数据获取失败'});
      }

      let sql2 = `select * from backendNav where navPId = ? and navStatus = 1 order by navIndex`
      for (let i = 0; i < result.length; i++) {
        conn.query(sql2, [result[i].navId], (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.send({code: 201, message: '数据获取失败'});
          }

          result[i].children = result2
          if (i == result.length - 1) {
            return res.send({code: 200, message: '数据获取成功', result: result});
          }
        })
      }
    })
  })
  //商品图片上传
  .post('/api/imgUploads', upload.single('articleImg'), (req, res) => {
    res.send({code: 200, message: "上传成功", filename: req.file.filename, path: req.file.path});
  })

module.exports = router_public;