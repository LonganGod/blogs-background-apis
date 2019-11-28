const express = require('express');
const app = express();
const path = require('path');
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

// const loginCheck = (req, res, next) => {
//   if (req.url.startsWith('/admin')) {
//     if (req.url != '/admin/login' && req.url != '/admin/checklogin') {
//       if (req.session.isAdmin != true) {
//         return res.redirect('/admin/login');
//       }
//     }
//     // 后台会话控制
//     next();
//   } else {
//     let num = 0;
//     const urlList = ['/index', '/indexProData', '/store', '/getStormData', '/product', '/getProData', '/sameKindProData', '/login', '/postSign', '/postLogin', '/search'];
//     urlList.forEach(function (item) {
//       if (!req.url.startsWith(item)) {
//         num++;
//       }
//     });
//     if (num == urlList.length) {
//       if (req.session.isLogin != true) {
//         return res.send({code: 201, message: '对不起，请您先进行登录'});
//       }
//     }
//     next();
//   }
// };
// app.use(loginCheck);

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