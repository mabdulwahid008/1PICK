const db = require("../db")

exports.addUserScore = async (e_id, u_id, is_yes) => {
    const total_volume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [e_id])

    let no_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [e_id])
    // no percentage
    let no_bet_percentage = parseInt((parseInt(no_bet_voloume.rows[0].sum) * 100 / parseInt(total_volume.rows[0].sum)))

    let yes_bet_percentage = 100 - no_bet_percentage

    let join_score = 1
    let probability_score = 0
    if(parseInt(is_yes) === 1){
        probability_score = Math.floor(yes_bet_percentage / 10)
    }
    else
        probability_score = Math.floor(no_bet_percentage / 10)

    await db.query('INSERT INTO USERS_SCORE(e_id, u_id, score) VALUES($1, $2, $3)', [e_id, u_id, (parseInt(join_score) + parseInt(probability_score))])
 
}


exports.removeUserScores = async(e_id, u_id) => {
    await db.query('DELETE FROM USERS_SCORE WHERE u_id = $1 AND e_id = $2', [u_id, e_id])
}
