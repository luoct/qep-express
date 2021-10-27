const express = require('express');
const expressJwt = require('express-jwt')
const cors = require('cors')
const compression = require('compression')


let app = express()

app.use(compression())

app.use('/', express.static('./dist'))

app.use(expressJwt({
    secret: 'luoct-secret',
    algorithms: ['HS256']
})
    .unless({
        path: ['/api', '/api/login', '/api/register']  // 指定路径不经过 Token 解析
    }))


app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token')
    }
})

app.use(cors())



app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json 



app.use('/api', require('./routes/index'))


// app.all('*', (req, res) => {
//     res.sendFile(__dirname + '/views/errrr.html')
// })


app.listen(3000, () => { console.log('端口3000') })
