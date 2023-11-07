const db = require("../db");
const { eventCanceled } = require("../utils/notifications");
const { removeUserScores } = require("../utils/scores");

exports.cancelEvent = async() => {
    try {
        console.log("Cancellation Bot Started");

        // getting events which are set for cancellation
        const cancel_event = await db.query('SELECT * FROM EVENTS WHERE is_active = -2 AND canceled = false')

        for (let i = 0; i < cancel_event?.rows?.length; i++) {
            if(cancel_event.rows[0].executed_as != -1) // meaning: event is terminated 
                continue;

            // getting bets of that event 
            const bets = await db.query('SELECT u_id, bet_amount FROM BETTING WHERE e_id = $1', [cancel_event?.rows[i]?._id])
            for (let j = 0; j < bets.rows.length; j++) {
                const user = await db.query('SELECT bet_amount, balance FROM USERS WHERE _id = $1', [bets.rows[j].u_id])
                let updated_balance = parseFloat(user.rows[0].balance) + parseFloat(bets.rows[j].bet_amount)
                let updated_bet_amount = parseFloat(user.rows[0].bet_amount) - parseFloat(bets.rows[j].bet_amount)
                await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3', [updated_balance, updated_bet_amount, bets.rows[j].u_id])
                
                await removeUserScores(cancel_event?.rows[j]?._id, bets.rows[j]?.u_id)
            }
            
            await eventCanceled(cancel_event?.rows[i]?._id)
            await db.query('UPDATE EVENTS SET canceled = true WHERE _id = $1', [cancel_event?.rows[i]?._id])
        }

        console.log("Cancellation Bot Ended");

    } catch (error) {
        console.log("cancel event");
        console.log(error.message);
    }
}