const express = require('express')
let router = express.Router()
let db = require('../../db/db')

router.get('/getInfo', (req, res) => {

    if (!req.user) {
        res.json({
            code: 0,
            msg: '获取信息失败',
        })
        return
    }
    console.log(req.user)
    console.log(req.query.stuNo)

    db.find({ stuNo: req.query.stuNo }, 'user', (data) => {
        console.log(data[0])

        if (!data[0]) {
            res.json({
                code: 0,
                msg: '获取信息失败',
            })
        } else {
            res.json({
                code: 1,
                msg: '获取信息成功',
                data: data[0]
            })
        }

    })
})


// 修改密码
router.post('/changePassword', (req, res) => {
    let newPwd = req.body.newPwd

    if (!req.user) {
        res.json({
            code: 0,
            msg: '失败',
        })
        return
    }

    db.updateOne({ 'stuNo': req.user.stuNo }, { 'password': newPwd }, 'user', (data) => {
        if (data.result.ok !== 1) {
            res.json({
                code: 0,
                msg: '失败',
            })
            return
        }
        res.json({ code: 1, msg: '修改密码成功' })
    })
})


// 修改个人信息
router.post('/changeInfo', (req, res) => {
    let changeInfo = req.body

    if (!req.user) {
        res.json({
            code: 0,
            msg: '失败',
        })
        return
    }

    db.updateOne({ stuNo: req.user.stuNo },
        {
            username: changeInfo.username,
            signature: changeInfo.signature,
            mobile: changeInfo.mobile,
        },
        'user',
        (data) => {
            if (data.result.ok !== 1) {
                res.json({ code: 0, msg: '修改信息失败' })
                return
            }
            console.log('data', data)
            res.json({ code: 1, msg: '修改信息成功' })
        }
    )
})


module.exports = router
