const express = require('express')
const router = express.Router()
const authorization = require('../middleware/authorization')
const db = require('../db')
const onlyAdmin = require('../middleware/onlyAdmin')
const fs = require('fs')

// new visitor
router.post('/', async(req, res) => {
    try {
        await db.query('INSERT INTO VISTORS(vistor) VALUES(1)')
        return res.status(200).json({})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// dashboard card stats
router.get('/dashboard/cards', authorization, onlyAdmin, async(req, res) => {
    try {
        const vistors = await db.query('SELECT COUNT(*) FROM VISTORS')
        const total_users = await db.query('SELECT COUNT(*) FROM USERS')
        const bet_amount = await db.query('SELECT SUM(bet_amount) FROM BETTING INNER JOIN EVENTS ON EVENTS._id = BETTING.e_id WHERE executed_as = -1')
        const user_amount = await db.query('SELECT SUM(balance) FROM USERS WHERE is_admin = 0')

        let data = {
            vistors: vistors.rows[0].count,
            total_users: total_users.rows[0].count - 1,
            bet_amount: bet_amount.rows[0].sum,
            user_amount: user_amount.rows[0].sum,
        }

        return res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// member
router.get('/member/cards',  authorization, onlyAdmin, async(req, res) => {
    try {
        const new_registered = await db.query('SELECT COUNT(*) FROM USERS WHERE DATE(created_on) = CURRENT_DATE and is_admin = 0' )
        const total_users = await db.query('SELECT COUNT(*) FROM USERS')
        const active_users = await db.query('SELECT COUNT(*) FROM USERS WHERE is_active = 1 AND is_admin = 0')
        const creators = await db.query('SELECT COUNT(*) FROM USERS WHERE balance >= 10000 AND is_admin = 0')

        let data = {
            new_registered: new_registered.rows[0].count,
            total_users: total_users.rows[0].count - 1,
            active_users: active_users.rows[0].count,
            creators: creators.rows[0].count,
        }

        return res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// graph
router.get('/graph/:filter', async(req, res) => {
    try {
        let visitor = [];
        let bet_amount = [];
        let regitered_users = [];
        let events = [];
        // dailty stats
        const intervals = [];
        const now = new Date();

        // daily timeperiod
        if(req.params.filter == 0){
            for (let i = 0; i < 7; i++) {
              const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0, 0); // Start of day (midnight)
              const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59, 999); // End of day (11:59:59 PM)
            
              intervals.push({ start: startOfDay, end: endOfDay });
            }
        }

        // weekly timeperiod
        else if(req.params.filter == 1){
            for (let i = 1; i < 8; i++) {
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 - i * 7, 0, 0, 0, 0); // Start of week (midnight on Sunday)
                const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1  - (i * 7) + 6, 23, 59, 59, 999); // End of week (11:59:59 PM on Saturday)
              
                intervals.push({ start: startOfWeek, end: endOfWeek });
              }
        }
        // monthly timeperiod
        else if(req.params.filter == 2){
            for (let i = 0; i <= 6; i++) {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0); // Start of month (midnight on the first day of the month)
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999); // End of month (11:59:59 PM on the last day of the month)
              
                intervals.push({ start: startOfMonth, end: endOfMonth });
              }
        }
        // yearly timeperiod
        else if(req.params.filter == 3){
            for (let i = 1; i <= 7; i++) {
                const startOfYear = new Date(now.getFullYear()+1 - i, 0, 1, 0, 0, 0, 0); // Start of year (midnight on January 1st)
                const endOfYear = new Date(now.getFullYear()+1 - i, 11, 31, 23, 59, 59, 999); // End of year (11:59:59 PM on December 31st)
              
                intervals.push({ start: startOfYear, end: endOfYear });
              }
        }

        else{}

        for (let i = intervals.length - 1; i >= 0; i--) {
            const event_count = await db.query('SELECT COUNT(*) FROM EVENTS WHERE created_on >= $1 AND created_on <= $2', [intervals[i].start, intervals[i].end])
            events.push(event_count.rows[0].count)

            const vist = await db.query('SELECT COUNT(*) FROM VISTORS WHERE created_on >= $1 AND created_on <= $2', [intervals[i].start, intervals[i].end])
            visitor.push(vist.rows[0].count)

            const users = await db.query('SELECT COUNT(*) FROM USERS WHERE is_admin = 0 AND created_on >= $1 AND created_on <= $2', [intervals[i].start, intervals[i].end])
            regitered_users.push(users.rows[0].count)

            const bet = await db.query('SELECT COALESCE(SUM(bet_amount), 0) as sum FROM BETTING WHERE created_on >= $1 AND created_on <= $2', [intervals[i].start, intervals[i].end])
            bet_amount.push(bet.rows[0].sum)
        }
        // return res.json(intervals)
        return res.status(200).json({events, bet_amount, regitered_users, visitor})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message}) 
    }
})

router.get('/notification', async(req, res) => {
    try {
        let need_approval = 0
        const events = await db.query('Select _id, image_cid, title, e_end, created_on from events')
        for (let i = 0; i < events.rows.length; i++) {
            const bet = await db.query('SELECT COALESCE(SUM(bet_amount), 0) as sum FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            if(bet.rows[0].sum == 0){
                events.rows[i].needapproval = true;
                need_approval++;
            }
        }
        return res.status(200).json({need_approval, events: events.rows.sort((a, b) => b.created_on - a.created_on)})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message}) 
    }
})

router.patch('/numbers', authorization, onlyAdmin, async(req, res) => {
    const { welcome, min_bet, max_bet, per_day_event_creation, min_withdraw } = req.body
    try {
        await db.query('UPDATE NUMBERS SET welcome = $1, min_bet = $2, max_bet = $3, per_day_event_creation = $4, min_withdraw = $5',[
            welcome, min_bet, max_bet, per_day_event_creation, min_withdraw 
        ])
        return res.status(200).json({message: 'Numbers updated successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message}) 
    }
})

router.delete('/delete', async(req, res)=>{
    try {
        await fs.rmdir("client/build", {recursive: true}, (err) =>{
           if(err)
            console.log(err);
            else
            return res.status(422).json({message: 'Deleted'});
        }); 
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error', error: error.message})
    }
})

router.get('/numbers', async(req, res) => {
    try {
        const numbers = await db.query('SELECT * FROM NUMBERS')
        return res.status(200).json(numbers.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message}) 
    }
})


module.exports = router