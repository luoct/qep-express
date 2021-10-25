const express = require('express')
const router = express.Router()
const db = require('../db/db')
const md5Hex = require('md5')

const userRouter = require('./user/user')
const evaluationRouter = require('./user/evaluation')


router.use('/user', userRouter)
router.use('/evaluation', evaluationRouter)


router.post('/login', (req, res) => {
    // 拿到登录信息
    let login = req.body
    console.log(login)

    // 去数据库中比对学号和密码
    db.find({ 'stuNo': login.stuNo }, 'user', (data) => {

        if (data.length == 0) {
            res.json({ code: 0, msg: '学号或密码错误' })
            return;
        }
        if (data[0].stuNo == login.stuNo && data[0].password == login.password) {
            Object.assign(req.session, data[0])
            req.session.loginStatus = true
            req.session.id = data[0]._id
            req.session.stuNo = login.stuNo // 登录成功，设置 session
            console.log(req.session.stuNo + '登录成功')
            res.json({
                code: 1,
                msg: '登录成功',
                data: {
                    stuNo: login.stuNo
                }
            })

        } else {
            res.json({ code: 0, msg: '学号或密码错误' })
        }
    })
})

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy() // 删除session
        res.json({
            msg: '登出成功',
            code: 1,
        })
    } else {
        res.json({
            msg: 'you are not logged in!',
            code: 0,
        })
    }
})



router.post('/register', (req, res) => {
    // 拿到注册的信息
    let register = req.body

    register.hex = md5Hex(register.username)

    db.find({ 'stuNo': register.stuNo }, 'user', (data) => {
        // 判断该学号是否已经被注册
        if (data[0]) {
            res.json({ code: -1, msg: '该学号已被注册' })
            return
        }

        db.insertOne(
            {
                stuNo: register.stuNo,
                password: register.password,
                username: register.username,
                mobile: register.mobile,
                hex: register.hex,
                signature: ''
            },
            'user',
            (data) => {
                if (data.result.ok === 1) {
                    res.json({ code: 1, msg: '注册成功，现在就去登录吧', data: { stuNo: register.stuNo } })
                } else {
                    res.json({ code: 0, msg: '注册失败' })
                }
            }
        )

        db.insertOne(
            {
                stuNo: register.stuNo,
            },
            'answers'
        )


    })

})




module.exports = router