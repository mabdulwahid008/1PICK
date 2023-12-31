const db = require('../db')
const { cancelEvent } = require('./cancelevent')
const { hideEventsAfter60days } = require('./hideEventsAfter60days')
const { terminateEvent } = require('./terminateEvent')

exports.filterEventsForTerminationAndCancellation = async() => {

    // getiing events which are not terminated and not reported or appealed
    const all_events = await db.query('SELECT _id, e_start, is_active, executed_as FROM EVENTS')
    let cancel_events = []
    let terminate_events = []


    for (let i = 0; i < all_events.rows.length; i++) {
        const d_date = new Date(all_events.rows[i].e_start); 
        if(d_date > new Date()) // if(event has not reached its d_date)
            continue;
        const twoDaysAfterDate = d_date.setHours(d_date.getHours() + 72); 
        if(twoDaysAfterDate > new Date()) // if(two days after d_date are not completed)
            continue;
    
            
        // check creator has taken the decision after two days
        const creatorHasTakenDecision = await db.query('SELECT * FROM EVENT_EXECUTION WHERE e_id = $1 ', [all_events.rows[i]._id])
        // if no decision has takeb
        if(creatorHasTakenDecision.rows.length === 0){
            if(all_events.rows[i].executed_as != 1)
            cancel_events.push(all_events.rows[i])
            continue;
        }
        
        // if decision has taken
        const decisionDate = new Date(creatorHasTakenDecision.rows[0].created_on)
        // add 72 hours to that decision
        const threeDaysAfterDecision = decisionDate.setHours(decisionDate.getHours() + 96)
        if(threeDaysAfterDecision > new Date()){
            continue;
        }

        terminate_events.push(all_events.rows[i])
    }

    for (let i = 0; i < cancel_events.length; i++) {
        // setting events for cancellation
        if(cancel_events[i].is_active != 0 ) // if event is reported or appealed, confirmation needed from admin
             await db.query('UPDATE EVENTS SET is_active = -2 WHERE _id = $1', [cancel_events[i]._id])
    }

    for (let i = 0; i < terminate_events.length; i++) {
        // setting events for termination
        if(terminate_events[i].is_active != 0 && terminate_events[i].executed_as == -1) // if event is reported or appealed, confirmation needed from admin
            await db.query('UPDATE EVENTS SET is_active = 2 WHERE _id = $1', [terminate_events[i]._id])
    }

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Wating for sometime to things get in their place");
        }, 30000);
    });

    await cancelEvent()

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Wating for sometime to things get in their place");
        }, 30000);
    });

    await terminateEvent()

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Wating for sometime to things get in their place");
        }, 30000);
    });
    
    await hideEventsAfter60days()
    
}


