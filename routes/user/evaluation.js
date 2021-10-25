const express = require('express')
let router = express.Router()
let db = require('../../db/db')


router.get('/getRatingScale', (req, res) => {
    let type = req.query.type

    db.find({ type }, 'ratingScales', (data) => {
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
router.post('/postAnswer', (req, res) => {
    let answer = req.body.answer

    db.updateOne(
        { stuNo: req.session.stuNo },
        { answer },
        'answers',
        (data) => {
            if (data.result.ok === 1) {
                res.json({ code: 1, msg: '提交成功', data: { stuNo: register.stuNo, score: -1, description: '暂无分数' } })
            } else {
                res.json({ code: 0, msg: '提交失败' })
            }
        }
    )
})





module.exports = router
