const express = require('express');
const app = express();
const path = require('path');
const conn = require('./tools/db');

app.listen(9988, () => {
  console.log('server is running at 9988');
});

app.engine('html', require('express-art-template'));

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(require('express-session')({
  secret: 'asdwqdaswxasx',
  resave: false,
  saveUninitialized: false
}));

const checkPermission = (req, res, next) => {
  let noPublicArr = ['/api/public/getBackendNavList', '/api/public/getAdminData', '/api/imgUploads', '/api/checkLogin', '/api/checkPermission']
  if (!req.path.includes('.') && !noPublicArr.includes(req.path)) {
    let sql = `select r.rolePermissions from adminInfo ai, role r where ai.adminRole = r.roleId and ai.adminId = ?`
    let sql1 = `select navJumpPage from backendnav where navId = ?`
    let hasPermission = false

    conn.query(sql, [req.body.adminId || req.query.adminId], (err, result) => {
      if (err) {
        console.log(err)
        return send({code: 202, message: '请求失败'})
      }
      let permissoionList = result[0].rolePermissions.split(',')
      for (let i = 0; i < permissoionList.length; i++) {
        conn.query(sql1, [parseInt(permissoionList[i])], (err1, result1) => {
          if (err1) {
            console.log(err1)
            return send({code: 202, message: '请求失败'})
          }
          if (result1[0].navJumpPage.split(',').includes(req.path)) {
            hasPermission = true
          }
          if (i == permissoionList.length - 1) {
            if (hasPermission) {
              next()
            } else {
              return res.send({code: 202, message: '请求失败'})
            }
          }
        })
      }
    })
  } else {
    next()
  }
};
app.use(checkPermission);

app.use('/serverImage', express.static(path.join(__dirname, '../serverImage')));

global.routerPath = __dirname;
global.serverPath = 'http://127.0.0.1:9988/serverImage/';

app.use(require('./router/router_userList'));
app.use(require('./router/router_userMsg'));
app.use(require('./router/router_backendNav'));
app.use(require('./router/router_public'));
app.use(require('./router/router_article'));
app.use(require('./router/router_labels'));
app.use(require('./router/router_role'));