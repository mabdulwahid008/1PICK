const express = require('express')
const router = express.Router()
const exceljs = require('exceljs')
const db = require('../db')


router.get('/users', async(req, res) => {
    try {
        const workbook = new exceljs.Workbook()

        const sheet = workbook.addWorksheet('Users')

        const users = await db.query('SELECT * FROM USERS')
        for (let i = 0; i < users.rows.length; i++) {
            const createdEvents = await db.query('SELECT COALESCE(COUNT(*), 0) AS count FROM EVENTS WHERE creator_id = $1', [users.rows[i]._id])
            users.rows[i].created_events = createdEvents.rows[0].count

            const score = await db.query('SELECT COALESCE(sum(score), 0) AS score FROM USERS_SCORE WHERE u_id = $1', [users.rows[i]._id]);
            users.rows[i].score = score.rows[0].score

            const joinedEvents = await db.query('SELECT  COALESCE(COUNT(*), 0) AS count FROM BETTING WHERE u_id = $1', [users.rows[i]._id])
            users.rows[i].joined_events = joinedEvents.rows[0].count
        }

        sheet.columns = [
            {header: 'ADDRESS', key:'address', width: 40},
            {header: 'Active', key:'active', width: 10},
            {header: 'SCORES', key:'score', width: 10},
            {header: 'BALANCE', key:'balance', width: 10},
            {header: 'ON BET', key:'bet_amount', width: 10},
            {header: 'EARNED', key:'earned_amount', width: 10},
            {header: 'LOST', key:'lost_amount', width: 10},
            {header: 'DEPOSITED', key:'deposited_amount', width: 10},
            {header: 'WITHDRAWN', key:'withdrawn_amount', width: 10},
            {header: 'JOINED', key:'joined', width: 10},
            {header: 'CREATED EVENTS', key:'created_events', width: 10},
            {header: 'JOINED EVENTS', key:'joined_events', width: 10},
        ]

        await users.rows.map((user, index) => {
            sheet.addRow({
                address: user.address,
                active: user.is_active == 1? 'YES' : 'NO',
                score: user.score,
                balance: user.balance,
                bet_amount: user.bet_amount,
                earned_amount: user.earned_amount,
                lost_amount: user.lost_amount,
                deposited_amount: user.deposited_amount,
                withdrawn_amount: user.withdrawn_amount,
                joined: user.created_on,
                created_events: user.created_events,
                joined_events: user.joined_events
            })
        })

        res.setHeader('Content-Type', 'Application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Users.xlsx');

        workbook.xlsx.write(res)

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router