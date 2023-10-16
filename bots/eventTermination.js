const db = require('../db')

exports.eventTermination = async() => {

    const all_events = await db.query('SELECT _id, e_start FROM EVENTS')
    let cancel_events = []
    let terminate_events = []
    for (let i = 0; i < all_events.rows.length; i++) {
        const d_date = new Date(all_events.rows[i].e_start); 
        if(d_date < new Date()) // if(event has not reached its d_date)
            continue;

        const twoDaysAfterDate = d_date.setHours(d_date.getHours() + 72); 
        if(twoDaysAfterDate > new Date()) // if(two days after d_date are not completed)
            continue;

        const creatorHasTakenDecision = await db.query('SELECT * FROM EVENT_EXECUTION WHERE e_id = $1', [all_events.rows[i]._id])
        if(creatorHasTakenDecision.rows.length === 0){
            console.log(d_date);
            cancel_events.push(all_events.rows[i])
            continue;
        }

        // if decision has taken
        // add 72 hours to that decision
        const decisionDate = new Date(creatorHasTakenDecision.rows[0].created_on)
        const threeDaysAfterDecision = decisionDate.setHours(decisionDate.getHours() + 72)
        console.log(decisionDate);
        console.log(threeDaysAfterDecision);
        if(threeDaysAfterDecision < new Date())
            continue;

        terminate_events.push(all_events.rows[i])
    }
    
    console.log(cancel_events);
    console.log(terminate_events);

    // 1.  48 hours after d-date, no decision taken 
    // cancel event


    // 2. if decision taken then after 72 hours terminates
    // 2.1 if event is appealed by 10 users then dont 
}