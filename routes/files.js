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

router.get('/events', async(req, res) => {
    try {
        const workbook = new exceljs.Workbook()

        const sheet = workbook.addWorksheet('Events')
        const events = await db.query(`SELECT EVENTS._id, title, pick, address, image_CID, content_CID, EVENTS.created_on, description, e_start, e_end, resolution_url, name, EVENTS.is_active, will_exeute_as, executed_as 
        FROM EVENTS
        LEFT JOIN USERS ON EVENTS.creator_id = USERS._id
        LEFT JOIN CATEGORIES ON EVENTS.c_id = CATEGORIES._id
        LEFT JOIN EVENT_EXECUTION ON EVENTS._id = EVENT_EXECUTION.e_id 
        ORDER BY EVENTS.created_on DESC;
        `)
        
        for (let i = 0; i < events.rows.length; i++) {
            const reports = await db.query('SELECT COALESCE(COUNT(*), 0) AS count FROM REPORTS_APPEAL WHERE reported = true AND e_id = $1', [events.rows[i]._id])
            const appeales = await db.query('SELECT COALESCE(COUNT(*), 0) AS count FROM REPORTS_APPEAL WHERE appealed = true AND e_id = $1', [events.rows[i]._id])
            const bets = await db.query('SELECT COALESCE(COUNT(*), 0) AS count FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            events.rows[i].reports = reports.rows[0].count
            events.rows[i].appeales = appeales.rows[0].count
            events.rows[i].bets = bets.rows[0].count

            let terminatied = ''
            if(events.rows[i].is_active == -2)
                terminatied = 'Canceled'
            else if(events.rows[i].is_active == -1){
                if(events.rows[i].executed_as == 1)
                    terminatied = 'Yes'
                else
                    terminatied = 'No'
            }
            else    
                terminatied = '----'
            
            events.rows[i].terminated = terminatied
        }

        
        sheet.columns = [
            {header: 'Title', key:'title', width: 40},
            {header: 'Pick', key:'pick', width: 15},
            {header: 'Description', key:'description', width: 40},
            {header: 'D-Date', key:'d_date', width: 10},
            {header: 'Participation Till', key:'p_date', width: 10},
            {header: 'Resolution URL', key:'r_url', width: 20},
            {header: 'Category', key:'c_name', width: 10},
            {header: 'Status', key:'status', width: 10},
            {header: 'Bets', key:'bets', width: 10},
            {header: 'Reported', key:'reported', width: 10},
            {header: 'Appealed', key:'appealed', width: 10},
            {header: 'Termination', key:'termination', width: 10},
            {header: 'Terminated', key:'terminated', width: 10},
            {header: 'Creator', key:'c_address', width: 30},
            {header: 'Created On', key:'created_on', width: 15},
            {header: 'Image URL', key:'img_url', width: 30},
            {header: 'IPFS CID', key:'ipfs_cid', width: 30},
        ]

        await events.rows.map((event, index) => {
            sheet.addRow({
                title: event.title,
                pick: event.pick,
                description: event.description,
                d_date: `${event.e_start}`,
                p_date: event.e_end,
                r_url: event.resolution_url,
                c_name: event.name,
                status: (event.is_active == -1 && 'Closed') || (event.is_active == -2 && 'Canceled') || (event.is_active == 0 && 'Pending') || (event.is_active == 1 && 'Active') || (event.is_active == 3 && 'Hidden') || (event.is_active == 2 && 'Distribution'),
                bets: event.bets,
                reported: event.reports,
                appealed: event.appeales,
                termination: event.will_exeute_as? event.will_exeute_as == 1? 'YES' : 'NO' : 'Not decided',
                terminated: event.terminated,
                c_address: event.address,
                created_on: event.created_on,
                img_url:  `https://1pick.xyz/${event.image_cid}`,
                ipfs_cid: event.content_cid,
            })
        })

        res.setHeader('Content-Type', 'Application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Events.xlsx');

        workbook.xlsx.write(res)
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router