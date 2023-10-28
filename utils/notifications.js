const db = require('../db')
const express = require('express')
const router = express.Router()

const minifyAddress = (address) => {
    const start = address.substr(0, 6)
    const end = address.substr(address.length - 4)
    return `${start}...${end}`
}

const eventCreated = async(u_id, e_title, pick) => {
    const user = await db.query('SELECT address from USERS WHERE _id = $1', [u_id])

    await db.query('INSERT INTO NOTIFICATIONS(text) VALUES($1)',[
        `${e_title.substr(0, 20)}-${pick} by ${minifyAddress(user.rows[0].address)}`
    ])
    
}

const eventCanceled = async(e_id) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])

    await db.query('INSERT INTO NOTIFICATIONS(text) VALUES($1)',[
        `${event.rows[0].title.substr(0, 20)}-${event.rows[0].pick} - CANCELLED`
    ])
}

const eventTerminated = async(e_id) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])

    await db.query('INSERT INTO NOTIFICATIONS(text) VALUES($1)',[
        `${event.rows[0].title.substr(0, 20)}-${event.rows[0].pick} - Terminated`
    ])
}

const betOnEvent = async(e_id, amount, is_yes) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])

    await db.query('INSERT INTO NOTIFICATIONS(is_yes, bet_amount, text) VALUES($1, $2, $3)',[
        is_yes==1? 'YES' : 'NO', amount, `${event.rows[0].title.substr(0, 20)} - ${event.rows[0].pick}`
    ])
}

router.get('/', async(req, res) => {
    try {
        // getting notification of activities
        const activities = await db.query("SELECT * FROM NOTIFICATIONS WHERE by_admin = false AND created_on >= current_timestamp - interval '5 minutes'")
        const by_admin = await db.query("SELECT * FROM NOTIFICATIONS WHERE by_admin = TRUE")

        const x = activities.rows.concat(by_admin.rows)

        return res.status(200).json(x)

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

router.post('/', async(req, res) => {
    const { text } = req.body
    try {
        await db.query('INSERT INTO NOTIFICATIONS(text, by_admin) VALUES($1, $2)',[
            text, true
        ])
        return res.status(200).json({message:'Announcement created.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})


router.get('/admin', async(req, res) => {
    try {
        const announcement = await db.query('SELECT _id, text FROM NOTIFICATIONS WHERE by_admin = TRUE')
        return res.status(200).json(announcement.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }  
})

router.delete('/:id', async(req, res) => {
    try {
        await db.query('DELETE FROM NOTIFICATIONS WHERE _id = $1', [req.params.id])
        return res.status(200).json({message: 'Announcement deleted.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:'Server Error'})
    }
})

module.exports = {router, betOnEvent, eventTerminated, eventCanceled, eventCreated}