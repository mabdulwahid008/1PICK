const db = require("../db")

exports.hideEventsAfter60days = async() => {
    try {
        console.log("Hide Bot Started");

        const canceled_events = await db.query('SELECT _id, created_on FROM EVENTS WHERE canceled = true')
        for (let i = 0; i < canceled_events.rows.length; i++) {
          const created_on = new Date(canceled_events.rows[i].created_on)
          const _33Days = created_on.setHours(created_on.getHours() + 792)
          if(_33Days < new Date())
            await db.query('UPDATE EVENTS SET is_active = 3 WHERE _id = $1', [canceled_events.rows[i]._id])
        }
        
        const terminated_events = await db.query('SELECT _id, e_start FROM EVENTS WHERE executed_as != -1')
        for (let i = 0; i < terminated_events.rows.length; i++) {
            const d_date = new Date(terminated_events.rows[i].e_start)
            const _33Days = d_date.setHours(d_date.getHours() + 792)
            if(_33Days < new Date())
                await db.query('UPDATE EVENTS SET is_active = 3 WHERE _id = $1', [terminated_events.rows[i]._id])
          }

          console.log("Hide Bot Ended");
    } catch (error) {
        console.log("hide event after 60 days");
        console.log(error.message);
    }
}