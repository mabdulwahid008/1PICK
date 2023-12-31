const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
const authorization = require('../middleware/authorization')
const bcrypt = require('bcrypt')
const onlyAdmin = require('../middleware/onlyAdmin')
const e = require('express')



// creating and logging in user
router.post('/', async(req, res) => {
    const { address } = req.body;
    try {
        const user = await db.query('SELECT * FROM USERS WHERE address = $1', [
            address
        ])
                if(user.rows?.length > 0){
                    if(user.rows[0].is_active == 0)
                        return res.status(400).json({message: 'You are restricted from this service.'})
                    // send JWT
                    const payload = {
                        user_id : user.rows[0]._id,
                        user_is_admin : false,
                    }
                    const token = jwt.sign(payload, process.env.SECERET_KEY, {expiresIn: "3hr"})

                    return res.status(200).json({token: token, balance: user.rows[0].balance, betting_ammount: user.rows[0].bet_amount, newUser: false})
                }
                else{
                    // create user
                    const balance = await db.query('SELECT welcome FROM NUMBERS')
                    
                    const user = await db.query('INSERT INTO USERS(address, balance) VALUES ($1, $2) returning *',[
                        address, balance.rows[0].welcome
                    ])

                    const payload = {
                        user_id : user.rows[0]._id,
                        user_is_admin : false,
                    }
                    const token = jwt.sign(payload, process.env.SECERET_KEY, {expiresIn: "3hr"})

                   
                    return res.status(200).json({token: token, balance: user.rows[0].balance, betting_ammount: 0, newUser: true})
                }
            
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// checking token if not expired then sending users data
router.get('/verify-token', authorization, async(req, res) => {
    try {
        const user = await db.query('SELECT address, is_active, balance, bet_amount FROM USERS WHERE _id = $1',[
            req.user_id
        ])

        if(user.rows[0].is_active == 0){
            return res.status(401).json({})
        }

        return res.status(200).json({address: user.rows[0].address, balance: user.rows[0].balance, betting_ammount: user.rows[0].bet_amount})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// deposit
router.patch('/deposit', authorization, async(req, res) => {
    const { deposit_amount } = req.body;
    try {
        const user = await db.query('SELECT balance, deposited_amount FROM USERS WHERE _id = $1', [req.user_id])
        const updatedBalance = parseInt(user.rows[0].balance) + parseInt(deposit_amount)
        const updatedDeposited_amount = parseInt(user.rows[0].deposited_amount) + parseInt(deposit_amount)

        await db.query('UPDATE USERS SET balance = $1, deposited_amount = $2 WHERE _id = $3', [
            updatedBalance, updatedDeposited_amount, req.user_id
        ])

        return res.status(200).json({message: 'Amount deposited successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// withdraw
router.patch('/withdraw', authorization, async(req, res) => {
    const { withdraw_amount } = req.body;
    try {
        const user = await db.query('SELECT balance, withdrawn_amount FROM USERS WHERE _id = $1', [req.user_id])
        const updatedBalance = parseInt(user.rows[0].balance) - parseInt(withdraw_amount)
        const updatedWithdraw_amount = parseInt(user.rows[0].withdrawn_amount) + parseInt(withdraw_amount)

        await db.query('UPDATE USERS SET balance = $1, withdrawn_amount = $2 WHERE _id = $3', [
            updatedBalance, updatedWithdraw_amount, req.user_id
        ])

        return res.status(200).json({message: 'Amount withdrawn successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})



// API to create an Admin
router.post('/admin', async(req, res) => {
    const { address, password } = req.body;
    try {

        const user = await db.query('SELECT * FROM USERS WHERE address = $1', [
            address
        ])

        if(user.rows?.length > 0)
            return res.status(422).json({message: 'User with this address already exists'})

        const salt = bcrypt.genSaltSync(10)
        const encryptedPass = bcrypt.hashSync(password, salt)

        await db.query('INSERT INTO USERS(address, balance, password, is_admin) VALUES ($1, $2, $3, $4)',[
            address, 100000000, encryptedPass, 1
        ])

        return res.status(200).json({message: 'User created.'})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// Admin Login
router.post('/admin/login', async(req, res) => {
    const { address, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM USERS WHERE address = $1 AND is_admin = 1', [
            address
        ])
        if(user.rows?.length == 0)
            return res.status(404).json({message: 'User not found with this address'})

        const comparePass = await bcrypt.compare(password, user.rows[0].password)

        if(!comparePass)
            return res.status(422).json({message: "Password is incorrect"})
        
        const payload = {
            user_id : user.rows[0]._id,
            user_is_admin : true
        }
        const token = jwt.sign(payload, process.env.SECERET_KEY, {expiresIn: "3hr"})

        return res.status(200).json({token: token,  balance: user.rows[0].balance, betting_ammount: user.rows[0].bet_amount})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to deactivate the user 
router.patch('/deactivate/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        await db.query('UPDATE USERS SET is_active = 0 WHERE _id = $1', [req.params.id])
        return res.status(200).json({message: 'User deactivated successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to activate the user 
router.patch('/activate/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        await db.query('UPDATE USERS SET is_active = 1 WHERE _id = $1', [req.params.id])
        return res.status(200).json({message: 'User activated successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

//admin to update balance of user to grant event creation 
router.patch('/transfer-balance', authorization, onlyAdmin, async(req, res) => {
    const { balance, user_id } = req.body
    try {

        const admin = await db.query('SELECT balance FROM USERS WHERE _id = $1',[
            req.user_id
        ])

        if(parseInt(admin.rows[0].balance) < parseInt(balance))
            return res.status(422).json({message: 'You have insufficient balance'})

            
        //updating admin's balance
        const admin_remaining_balance = parseInt(admin.rows[0].balance) - parseInt(balance)

        await db.query('UPDATE USERS SET balance = $1 WHERE _id = $2',[
            admin_remaining_balance, req.user_id
        ])

        // updating user balance
        const user  = await db.query('SELECT balance FROM USERS WHERE _id = $1',[
            user_id
        ])
        const updated_balance = parseInt(user.rows[0].balance) + parseInt(balance)

        await db.query('UPDATE USERS SET balance = $1 WHERE _id = $2',[
            updated_balance, user_id
        ])
        return res.status(200).json({message:'Amount transfered successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to get all users 
router.get('/lisiting/:filter/:searchAddress', authorization, onlyAdmin, async(req, res) => {
    try {
        if(req.params.searchAddress !== 'x' && req.params.searchAddress.length > 3){
            const users = await db.query('SELECT _id, address, created_on, bet_amount, balance, is_active FROM USERS WHERE address = $1', [req.params.searchAddress])
            const score = await db.query('Select COALESCE(sum(score), 0) AS score From USERS_SCORE where u_id = $1', [users.rows[0]._id])
            users.rows[0].score = score.rows[0].score
            return res.status(200).json(users.rows)
        }
        else{
            const users = await db.query('SELECT _id, address, created_on, bet_amount, balance, is_active FROM USERS WHERE _id != $1 ORDER BY created_on DESC', [req.user_id])
            for (let i = 0; i < users.rows.length; i++) {
                const score = await db.query('Select COALESCE(sum(score), 0) AS score From USERS_SCORE where u_id = $1', [users.rows[i]._id])
                users.rows[i].score = score.rows[0].score
            }
            if(req.params.filter == 0)
                return res.status(200).json(users.rows)
            else if(req.params.filter == 1) // sort by bet ammount
                return res.status(200).json(users.rows.sort((a, b) => b.bet_amount - a.bet_amount))
            else if(req.params.filter == 2) // sort by balance
                return res.status(200).json(users.rows.sort((a, b) => b.balance - a.balance))
            else if(req.params.filter == 3) // // sort by scores
                return res.status(200).json(users.rows.sort((a, b) => b.score - a.score))
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

router.get('/single/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        const users = await db.query('SELECT * FROM USERS WHERE _id = $1', [req.params.id])
        
        const paricipatedEvents = await db.query('SELECT COUNT(*) FROM BETTING WHERE u_id = $1', [users.rows[0]._id])
        const createdEvents = await db.query('SELECT COUNT(*) FROM EVENTS WHERE creator_id = $1', [users.rows[0]._id])
        users.rows[0].paricipatedEvents = paricipatedEvents.rows[0].count
        users.rows[0].createdEvents = createdEvents.rows[0].count
            
        return res.status(200).json(users.rows[0])
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})


// user ranking page
router.get('/rankings/:filter', async(req, res) => {
    try {
        const users = await db.query('Select _id, address From Users')
        for (let i = 0; i < users.rows.length; i++) {
            const joinevents = await db.query('Select COALESCE(COUNT(*), 0) AS joinevents From BETTING where u_id = $1', [users.rows[i]._id])
            users.rows[i].joinevents = joinevents.rows[0].joinevents
            const createdEvents = await db.query('Select COALESCE(COUNT(*), 0) AS createdEvents From EVENTS where creator_id = $1', [users.rows[i]._id])
            users.rows[i].createdEvents = createdEvents.rows[0].createdevents
            const score = await db.query('Select COALESCE(sum(score), 0) AS score From USERS_SCORE where u_id = $1', [users.rows[i]._id])
            users.rows[i].score = score.rows[0].score
        }

        let sortByRanking = users.rows.sort((a, b) => a.score - b.score) // sorted in ASC order
        let first100RankingUsers = sortByRanking.slice(sortByRanking.length-101, sortByRanking.length-1) 
        let data = []
        switch(parseInt(req.params.filter)){
            case 0:
                data = first100RankingUsers.sort((a, b) => a.score - b.score)
            break;
            case 1:
                data = first100RankingUsers.sort((a, b) => a.joinevents - b.joinevents)
            break;
            case 2:
                data = first100RankingUsers.sort((a, b) => a.createdEvents - b.createdEvents)
            break;
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})


// user score portfolio
router.get('/user-metadata/:address', async(req, res) => {
    try {
        const user = await db.query('SELECT _id FROM USERS WHERE address = $1', [req.params.address])
        const joinevents = await db.query('Select COALESCE(COUNT(*), 0) AS joinevents From BETTING where u_id = $1', [user.rows[0]._id])
        const createdEvents = await db.query('Select COALESCE(COUNT(*), 0) AS createdEvents From EVENTS where creator_id = $1', [user.rows[0]._id])
        const score = await db.query('Select COALESCE(sum(score), 0) AS score From USERS_SCORE where u_id = $1', [user.rows[0]._id])

        const allUser_scores = await db.query('SELECT u_id, COALESCE(SUM(score), 0) AS total_score FROM USERS_SCORE GROUP BY u_id ORDER BY total_score DESC')

        let index = allUser_scores.rows.findIndex(item => item.u_id === user.rows[0]._id && item.total_score === score.rows[0].score);

        return res.status(200).json({
            joined_events: joinevents.rows[0].joinevents,
            created_events: createdEvents.rows[0].createdevents,
            score: score.rows[0].score,
            rank : index + 1 // index starts from 0 
        })
          
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})




module.exports = router;