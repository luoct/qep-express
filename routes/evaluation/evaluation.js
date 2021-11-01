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


router.post('/postAnswer', (req, res) => {

    let answer = req.body.answer
    let type = req.body.type
    let score = computedScore(type, answer)


    db.updateOne(
        { stuNo: req.user.stuNo },
        { [type]: answer },
        'answers',
        (data) => {
            if (data.result.ok === 1) {
                res.json({ code: 1, msg: '提交成功', data: { stuNo: req.user.stuNo, score: score } })
            } else {
                res.json({ code: 0, msg: '提交失败' })
            }
        }
    )


    db.updateOne(
        { stuNo: req.user.stuNo },
        { [type]: score },
        'scores'
    )

})


module.exports = router



// 计算得分的函数
let computedScore = (type, answerArr) => {
    let score = 0
    switch (type) {
        case 'SAS':
            answerArr.map((v, index) => {
                if ([4, 8, 12, 16, 18].indexOf(index) === -1) {
                    score += (Number(v) + 1)
                } else {
                    if (v === 0) score += 4
                    else if (v === 1) score += 3
                    else if (v === 2) score += 2
                    else if (v === 3) score += 1
                }
            })
            score *= 1.25
            score = Math.round(score)
            break;

        default:
            break;
    }
    return score
}