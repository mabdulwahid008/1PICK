exports.terminateEvent = async() => {
    try {
        // get events which need termination
        // is_active = 2 means event need termination
        // executed_as = -1 means event has not not terminated yet
        const events_need_termination = await db.query('SELECT _id FROM EVENTS WHERE is_active = 2 AND executed_as = -1')

        for (let i = 0; i < events_need_termination.rows.length; i++) {
            const bettings = await db.query('SELECT u_id, bet_amount, is_yes FROM BETTING WHERE e_id = $1', [events_need_termination.rows[i]._id])
            const total_volume = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [events_need_termination.rows[i]._id])
            const creator_id = await db.query('SELECT creator_id FROM EVENTS WHERE _id = $1', [events_need_termination.rows[i]._id])
            
            const will_exeute_as = await db.query('SELECT will_exeute_as FROM EVENT_EXECUTION WHERE e_id = $1', [events_need_termination.rows[i]._id])

            const is_yes = will_exeute_as.rows[0].will_exeute_as

            const usersWhoBetRight = bettings.rows.filter((bet) => bet.is_yes == is_yes)
            const usersWhoBetWrong = bettings.rows.filter((bet) => bet.is_yes != is_yes)
            
            // giving creator 1% of total volume
            const percent_1 = parseFloat(total_volume.rows[0].sum) / 100 
            // left 99% of total valume
            const left_volume = parseFloat(total_volume.rows[0].sum) - parseFloat(percent_1)
    
            // get creator data
            const creator = await db.query('SELECT balance, earned_amount FROM USERS WHERE _id = $1', [creator_id.rows[0].creator_id])
            // calculate amounts
            const creator_updated_balance =  parseFloat(percent_1) + parseFloat(creator.rows[0].balance)
            const creator_earned_amount =  parseFloat(percent_1) + parseFloat(creator.rows[0].earned_amount)
            // update creator balance
            await db.query('UPDATE USERS SET balance = $1, earned_amount = $2 WHERE _id = $3', [
                creator_updated_balance, creator_earned_amount, creator_id.rows[0].creator_id
            ])
  
            // transerfering left wolume to user's account who bet right
            const sum_of_winners_bet = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = $1 AND e_id = $2', [is_yes, events_need_termination.rows[i]._id])
    
            for (let j = 0; j < usersWhoBetRight.length; j++) {
                    let user_return = parseFloat(left_volume) * (parseFloat(usersWhoBetRight[j].bet_amount) / parseFloat(sum_of_winners_bet.rows[0].sum))
    
                    const user = await db.query('SELECT balance, earned_amount, bet_amount FROM USERS WHERE _id = $1', [usersWhoBetRight[j].u_id])
    
                    const updated_user_balance = parseFloat(user_return) + parseFloat(user.rows[0].balance)
                    const updated_earned_amount = parseFloat(user_return) + parseFloat(user.rows[0].earned_amount)
                    const updated_bet_amount = Math.abs(parseFloat(user.rows[0].bet_amount) - parseFloat(usersWhoBetRight[j].bet_amount))
    
                    await db.query('UPDATE USERS SET balance = $1, earned_amount = $2, bet_amount = $3 WHERE _id = $4', [
                        updated_user_balance, updated_earned_amount, updated_bet_amount, usersWhoBetRight[j].u_id
                    ])
            }
    
            // handling lossers
            for (let j = 0; j < usersWhoBetWrong.length; j++) {
                    const user = await db.query('SELECT bet_amount, lost_amount FROM USERS WHERE _id = $1', [usersWhoBetWrong[j].u_id])
                    const updated_lost_amount = parseFloat(user.rows[0].lost_amount) + parseFloat(usersWhoBetWrong[j].bet_amount)
                    const updated_bet_amount = Math.abs(parseFloat(user.rows[0].bet_amount) - parseFloat(usersWhoBetWrong[j].bet_amount))
    
                    await db.query('UPDATE USERS SET bet_amount = $1, lost_amount = $2 WHERE _id = $3', [
                        updated_bet_amount, updated_lost_amount, usersWhoBetWrong[j].u_id
                    ])
            }

            await db.query('UPDATE EVENTS SET executed_as = $1, is_active = -1 WHERE _id = $2', [is_yes, events_need_termination.rows[i]._id])
        }

    } catch (error) {
        console.log("Termination Event");
        console.log(error.message);
    }
}