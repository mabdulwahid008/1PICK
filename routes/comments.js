const express = require('express')
const router = express.Router()
const authorization = require('../middleware/authorization')
const db = require('../db')

router.post('/', authorization, async(req, res) => {
    const { content, e_id, p_comment_id } = req.body
    try {
        if(p_comment_id)
            await db.query('INSERT INTO EVENT_COMMENTS(content, e_id, u_id, p_comment_id) VALUES($1, $2, $3, $4)', [content, e_id, req.user_id, p_comment_id])
        else
            await db.query('INSERT INTO EVENT_COMMENTS(content, e_id, u_id) VALUES($1, $2, $3)', [content, e_id, req.user_id])
        return res.status(200).json({})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

router.get('/:e_id', async(req, res) => {
    try {
        const comments = await db.query('SELECT EVENT_COMMENTS._id, content, address, EVENT_COMMENTS.created_on FROM EVENT_COMMENTS INNER JOIN USERS ON USERS._id = EVENT_COMMENTS.u_id WHERE p_comment_id IS null AND e_id = $1 ORDER BY created_on ASC', [req.params.e_id])
        for (let i = 0; i < comments.rows.length; i++) {
            child = await db.query('SELECT COALESCE(COUNT(*), 0) as count FROM EVENT_COMMENTS WHERE p_comment_id = $1', [comments.rows[i]._id])
            comments.rows[i].replied = child.rows[0].count
            
            const replied_comments = await db.query('SELECT EVENT_COMMENTS._id, content, address, EVENT_COMMENTS.created_on FROM EVENT_COMMENTS INNER JOIN USERS ON USERS._id = EVENT_COMMENTS.u_id WHERE p_comment_id = $1 ORDER BY created_on ASC', [comments.rows[i]._id])
            comments.rows[i].replied_comments = replied_comments.rows
        }
        return res.status(200).json(comments.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

 


module.exports = router