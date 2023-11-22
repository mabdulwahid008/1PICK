const db = require("../db")

exports.approveEvent = async(event_id) => {
    const approval_amount = 100

        // checking admin has enough balance
        const admin = await db.query('SELECT _id, balance, bet_amount FROM USERS WHERE address = $1',[
            '0xEC8F0878d693c1010B0eba17cCBe6f491CFc352C'
        ])

        if(parseInt(admin.rows[0].balance) < approval_amount)
            return res.status(422).json({message: 'Admin has insufficient balance to approve this event.'})


        // approving event
        await db.query('UPDATE EVENTS SET is_approved = 1, is_active = 1 WHERE _id = $1',[
            event_id
        ])

        // 50 to YES and 50 to NO
        // to NO
        await db.query('INSERT INTO BETTING(e_id, u_id, bet_amount, is_yes) VALUES($1, $2, $3, $4)',[
            event_id, admin.rows[0]._id, (approval_amount/2), 0
        ])
        // to YES
        await db.query('INSERT INTO BETTING(e_id, u_id, bet_amount, is_yes) VALUES($1, $2, $3, $4)',[
            event_id, admin.rows[0]._id, (approval_amount/2), 1
        ])

        // updaing admin's balance
        const admin_remaining_balance = parseFloat(admin.rows[0].balance) - approval_amount

        // update admin's bet_amount
        const admin_bet_amount = parseFloat(admin.rows[0].bet_amount) + approval_amount

        await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3',[
            admin_remaining_balance, admin_bet_amount, admin.rows[0]._id
        ])


        // admin score 
        // in the begin, there is 50%
        // so placing two bets, the join score will be 1+1, and probability score will be 5+5 = 12
        await db.query('INSERT INTO USERS_SCORE(e_id, u_id, score) VALUES($1, $2, $3)', [event_id, admin.rows[0]._id, 12])
}