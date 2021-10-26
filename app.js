const express = require('express');
const expressJwt = require('express-jwt')
const cors = require('cors')


let app = express()


app.use(expressJwt({
    secret: 'luoct-secret',
    algorithms: ['HS256']
})
    .unless({
        path: ['/api', '/api/login', '/api/register']  // 指定路径不经过 Token 解析
    }))


app.use(cors())

// app.use('/', express.static('./dist'))


app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json 



app.use('/api', require('./routes/index'))


app.all('*', (req, res) => {
    res.sendFile(__dirname + '/views/errrr.html')
})


app.listen(3000, () => { console.log('端口3000') })
