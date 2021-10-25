const express = require('express');
const session = require('express-session');


let app = express();


// 静态资源
app.use('/', express.static('./dist'))

// 使用session
app.use(session({
    secret: 'ahahaha', // 对session id 相关的cookie 进行签名
    resave: false,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 设置 session 的有效时间，单位毫秒
    },
}))

// 解析数据
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json 


// 使用路由
app.use('/', require('./routes/index'))


app.all('*', (req, res) => {
    res.sendFile(__dirname + '/views/errrr.html')
})


// 在3000端口监听服务
server.listen(3000, () => { console.log('端口3000') })
