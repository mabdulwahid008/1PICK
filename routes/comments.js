const express = require('express')
const router = express.Router()
const authorization = require('../middleware/authorization')

router.post('/', authorization, async(req, res) => {
    const { content, e_id, p_comment_id } = req.body
    try {
        if(p_comment_id)
            await db.query('INSERT INTO EVENT_COMMENTS(content, e_id, u_id, p_comment_id) VALUES($1. $2, $3, $4)', [content, e_id, req.user_id, p_comment_id])
        else
            await db.query('INSERT INTO EVENT_COMMENTS(content, e_id, u_id) VALUES($1. $2, $3)', [content, e_id, req.user_id])
        return res.status(200)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})



module.exports = router