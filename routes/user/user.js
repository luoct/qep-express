const express = require('express')
let router = express.Router()
let db = require('../../db/db')

router.get('/getInfo', (req, res) => {
    // req.session.stuNo = '2012623053'
    if (req.query.stuNo !== req.session.stuNo) {
        console.log('req.query.stuNo !== req.session.stuNo')
        res.json({
            code: 0,
            msg: '获取信息失败',
        })
    }
    db.find({ stuNo: req.session.stuNo }, 'user', (data) => {
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

    // req.session.stuNo = '2012623053'
    if (req.body.stuNo !== req.session.stuNo) {
        console.log('req.query.stuNo !== req.session.stuNo')
        res.json({
            code: 0,
            msg: '修改密码失败',
        })
        return
    }
    db.updateOne({ 'stuNo': req.session.stuNo }, { 'password': newPwd }, 'user', (data) => {
        if (data.result.ok !== 1) {
            res.json({
                code: 0,
                msg: '失败',
            })
            return
        }
        req.session.destroy()
        res.json({ code: 1, msg: '修改密码成功' })
    })
})


// 修改个人信息
router.post('/changeInfo', (req, res) => {
    let changeInfo = req.body
    if (req.body.stuNo !== req.session.stuNo) {
        console.log('req.query.stuNo !== req.session.stuNo')
        res.json({
            code: 0,
            msg: '修改密码失败',
        })
        return
    }
    db.updateOne({ stuNo: req.session.stuNo },
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
