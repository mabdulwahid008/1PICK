const express = require('express')
const router = express.Router()
const authorization = require('../middleware/authorization')
const db = require('../db')
const onlyAdmin = require('../middleware/onlyAdmin')
const { uploadJSONToIPFS, deleteFromIPFS } = require('../ipfs')
const imageUpload = require('../utils/imageUpload')
const { approveEvent } = require('../utils/approveEvent')
const { addUserScore, removeUserScores } = require('../utils/scores')


// cretaing an event
router.post('/create', authorization, imageUpload.single("image"), async(req, res)=> {
    const { title, description, d_date, resolution_url, c_id, image_CID, pick } = req.body;
    try {
        let inputDate = new Date(d_date+":00.000Z");
        let time = inputDate.setHours(inputDate.getHours() - 3);

        var date = new Date(time);
        var year = date.getUTCFullYear();
        var month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        var day = date.getUTCDate().toString().padStart(2, '0');
        var hours = date.getUTCHours().toString().padStart(2, '0');
        var minutes = date.getUTCMinutes().toString().padStart(2, '0');

        var e_end = `${year}-${month}-${day}T${hours}:${minutes}`;

        if(req.is_admin){
            const content_CID = await uploadJSONToIPFS(title, description, d_date, e_end, resolution_url, c_id, req.user_id, req.file.path, pick)

            const event = await db.query('INSERT INTO EVENTS(title, description, e_start, e_end, resolution_url, image_CID, content_CID, c_id, creator_id, is_active, is_approved, pick) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *',[
                title, description, d_date, e_end, resolution_url, req.file.path, content_CID, c_id, req.user_id, 0, 0, pick
            ])

            await approveEvent(event.rows[0]._id)

            return res.status(200).json({message: 'Event created successfully.'})
        }


        
        const content_CID = await uploadJSONToIPFS(title, description, d_date, e_end, resolution_url, c_id, req.user_id, req.file.path, pick)

        // have to remove is_active, is_approved WHEN WORKING ON ADMIN SIDE
        const event = await db.query('INSERT INTO EVENTS(title, description, e_start, e_end, resolution_url, image_CID, content_CID, c_id, creator_id, is_active, is_approved, pick) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *',[
            title, description, d_date, e_end, resolution_url, req.file.path, content_CID, c_id, req.user_id, 0, 0, pick
        ])

        await approveEvent(event.rows[0]._id)

        return res.status(200).json({message: 'Event created successfully.'})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// get events
router.get('/', async(req, res) => {
    let page = req.query.page
    let category = req.query.category
    let sideTop = req.query.sidetop
    let filter = req.query.filter?.split(',')
    try {
        let limit = 10
        let offset = (parseInt(page) - 1) * limit
        let users = []
        let totalEvents;
        let events;
        let data = [];
        let total_data = 0;

        if(filter.includes('1')){
            let creators = await db.query("select * from ( SELECT COUNT(*) total_event , creator_id FROM EVENTS  group by creator_id ) ewta where total_event <= 10")
            for (let i = 0; i < creators.rows.length; i++) {
                users.push(creators.rows[i].creator_id)
            }
        }
        if(filter.includes('2')){
            let creators = await db.query("select * from ( SELECT COUNT(*) total_event , creator_id FROM EVENTS  group by creator_id ) ewta where total_event > 10 and total_event <= 100  ")
            for (let i = 0; i < creators.rows.length; i++) {
                users.push(creators.rows[i].creator_id)
            }
        }
        if(filter.includes('3')){
            let creators = await db.query("select * from ( SELECT COUNT(*) total_event , creator_id FROM EVENTS  group by creator_id ) ewta where total_event >= 100")
            for (let i = 0; i < creators.rows.length; i++) {
                users.push(creators.rows[i].creator_id)
            }
        }

        if(users.length === 0){
            return res.status(200).json({totalEvents: 0, events: []})
        }
        
        users = users.join(',')
        // category filter
        if(category == 0){
            totalEvents = await db.query(`SELECT COUNT(*) FROM EVENTS WHERE is_active = 1 AND creator_id IN (${users})`)
            total_data += parseInt(totalEvents.rows[0].count)

            events = await db.query(`SELECT EVENTS._id, title, e_start, views, pick, EVENTS.created_on, EVENTS.is_active, image_CID, address AS creator, name AS c_name FROM EVENTS 
                                            INNER JOIN CATEGORIES 
                                                ON EVENTS.c_id = CATEGORIES._id 
                                            INNER JOIN USERS 
                                                ON EVENTS.creator_id = USERS._id 
                                                    WHERE EVENTS.is_active = 1 AND EVENTS.creator_id IN (${users}) ORDER BY EVENTS._id DESC`)
            for (let j = 0; j < events.rows.length; j++) {
                data.push(events.rows[j])
            }
        }
        else{
            totalEvents = await db.query(`SELECT COUNT(*) FROM EVENTS WHERE is_active = 1 AND c_id = $1  AND creator_id IN (${users})`, [category])
            total_data += parseInt(totalEvents.rows[0].count)
            events = await db.query(`SELECT EVENTS._id, title, e_start,pick, views, EVENTS.created_on, EVENTS.is_active, image_CID, address AS creator, name AS c_name FROM EVENTS 
                                            INNER JOIN CATEGORIES 
                                                ON EVENTS.c_id = CATEGORIES._id 
                                            INNER JOIN USERS 
                                                ON EVENTS.creator_id = USERS._id 
                                                    WHERE EVENTS.is_active = 1 AND c_id = $1 AND EVENTS.creator_id IN (${users}) ORDER BY EVENTS._id DESC`,[
                category
            ])
            for (let j = 0; j < events.rows.length; j++) {
                data.push(events.rows[j])
            }
        }

        // volume and percentage
        for (let i = 0; i < data.length; i++) {
            // total valume
            const total_volume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [data[i]._id])
            data[i].total_volume = total_volume.rows[0].sum

            // RESPONSES 
            const responses = await db.query('SELECT COUNT(*) FROM BETTING WHERE e_id = $1', [data[i]._id])
            data[i].responses = responses.rows[0].count

            let no_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [data[i]._id])
            // no percentage
            let no_bet_percentage = (parseInt(no_bet_voloume.rows[0].sum) * 100 / parseInt(total_volume.rows[0].sum))
            data[i].no_bet_percentage = no_bet_percentage
            
        }

        // number of bets
        for (let i = 0; i < data.length; i++) {
            let bet_count = await db.query('SELECT COUNT(*) FROM BETTING WHERE e_id = $1', [data[i]._id])
            data[i].bet_count = bet_count.rows[0].count
        }

        // filter by side bar top 
        if(sideTop == 0)
            data = data.sort((a, b) => b.bet_count - a.bet_count);
        else if(sideTop == 1)
            data = data.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
        else if(sideTop == 2)
            data = data.sort((a, b) => new Date(a.e_start) - new Date(b.e_start));
        else if(sideTop == 3)
            data = data.sort((a, b) => parseInt(b.total_volume) - parseInt(a.total_volume));
        else{}


        return res.status(200).json({totalEvents: total_data, events: data})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// search event by title
router.get('/search/:title', async(req, res) => {
    try {
        
        const events = await db.query('SELECT _id, image_CID, title FROM EVENTS WHERE title ILIKE $1 AND is_active = 1', [`%${req.params.title}%`]);

        for (let i = 0; i < events.rows.length; i++) {
            // total valume
            const total_volume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            events.rows[i].total_volume = total_volume.rows[0].sum
        }

        return res.status(200).json(events.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin search event by title
router.get('/admin/search/:title', async(req, res) => {
    try {

        const events = await db.query('SELECT _id, image_CID, title, is_active FROM EVENTS WHERE title ILIKE $1', [`%${req.params.title}%`]);

        for (let i = 0; i < events.rows.length; i++) {
            // total valume
            const total_volume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            events.rows[i].total_volume = total_volume.rows[0].sum? total_volume.rows[0].sum : 0
        }

        return res.status(200).json(events.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// single event
router.get('/single/:id', async(req, res) => {
    try {
        const event = await db.query(`SELECT EVENTS._id, title, pick, description, content_CID, e_start, e_end, resolution_url, image_CID, address AS creator, c_id, name AS c_name FROM EVENTS 
                                            INNER JOIN CATEGORIES 
                                                ON EVENTS.c_id = CATEGORIES._id 
                                            INNER JOIN USERS 
                                                ON EVENTS.creator_id = USERS._id 
                                                    WHERE EVENTS._id = $1 AND EVENTS.is_active = 1`,[
            req.params.id
        ])
        if(event.rows.length === 0)
            return res.status(404).json({})

        // total valume
        const total_volume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [req.params.id])
        event.rows[0].total_volume = total_volume.rows[0].sum
        // yes, no percentage

        let yes_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 1 AND e_id = $1', [req.params.id])

        let yes_bet_percentage = (parseInt(yes_bet_voloume.rows[0].sum) * 100 / parseInt(total_volume.rows[0].sum))
        event.rows[0].yes_bet_percentage = yes_bet_percentage
        event.rows[0].no_bet_percentage = 100 - yes_bet_percentage

        const bettors = await db.query('Select BETTING._id, address as user, BETTING.bet_amount, BETTING.created_on, is_yes FROM BETTING INNER JOIN USERS on u_id = USERS._id WHERE e_id = $1 ORDER BY BETTING._id DESC', [req.params.id])

        event.rows[0].bettors = bettors.rows

        return res.status(200).json(event.rows[0])
                                                
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// single event graph stats
router.get('/stats/:event_id', async (req, res) => {
    try {
      let yes_stats = [];
      let no_stats = [];
  
      const now = new Date();
      const intervals = [];
  
      for (let i = 0; i < 13; i++) {
        // const timeStart = new Date(now.getTime() - (i + 1) * 5 * 60 * 1000); // Start of interval
        // const timeEnd = new Date(now.getTime() - i * 5 * 60 * 1000); // End of interval
        // intervals.push({ start: timeStart, end: timeEnd });

        const timeStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000); // Start of interval (1 hour)
        const timeEnd = new Date(now.getTime() - i * 60 * 60 * 1000); // End of interval (1 hour)
        intervals.push({ start: timeStart, end: timeEnd });
      }

      const total_yes_no_amount =await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [req.params.event_id])
  
      for (let i = 12; i >= 0; i--) {
        const yes_amount_in_5mins = await db.query('SELECT COALESCE(SUM(bet_amount), 0) AS total_bet_amount FROM BETTING WHERE is_yes = 1 AND e_id = $1 AND created_on >= $2 AND created_on <= $3',[
            req.params.event_id, intervals[i].start, intervals[i].end
        ]);
        yes_stats.push((parseInt(yes_amount_in_5mins.rows[0].total_bet_amount) / parseInt(total_yes_no_amount.rows[0].sum)) * 100);
        const no_amount_in_5mins = await db.query('SELECT COALESCE(SUM(bet_amount), 0) AS total_bet_amount FROM BETTING WHERE is_yes = 0 AND e_id = $1 AND created_on >= $2 AND created_on <= $3',[
            req.params.event_id, intervals[i].start, intervals[i].end
        ]);
        no_stats.push((parseInt(no_amount_in_5mins.rows[0].total_bet_amount) / parseInt(total_yes_no_amount.rows[0].sum) )* 100);
      }

      // total bet_amount
      const total_yes_amount = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = 1 AND e_id = $1', [req.params.event_id])
      const total_no_amount = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [req.params.event_id])

      // bet amount in previous hour
    //   const hourly_yes_amount = await db.query(`SELECT COALESCE(SUM(bet_amount) , 0) as sum FROM BETTING WHERE created_on >= NOW() - INTERVAL '1 hour' AND created_on < NOW() AND e_id = $1 AND is_yes = 1`, [req.params.event_id])
    //   const hourly_no_amount = await db.query(`SELECT COALESCE(SUM(bet_amount) , 0) as sum FROM BETTING WHERE created_on >= NOW() - INTERVAL '1 hour' AND created_on < NOW() AND e_id = $1 AND is_yes = 0`, [req.params.event_id])
    //   let data = {
    //         is_yes : parseFloat(hourly_yes_amount.rows[0].sum) > parseFloat(hourly_no_amount.rows[0].sum) ? 1 : 0,
    //         hourly_amount: parseFloat(hourly_yes_amount.rows[0].sum) > parseFloat(hourly_no_amount.rows[0].sum) ? hourly_yes_amount.rows[0].sum : hourly_no_amount.rows[0].sum,
    //         total_amount : parseFloat(hourly_yes_amount.rows[0].sum) > parseFloat(hourly_no_amount.rows[0].sum) ? total_yes_amount.rows[0].sum : total_no_amount.rows[0].sum, 
    //     }
    //     data.percentage= (parseFloat(data.hourly_amount) * 100) / parseFloat(data.total_amount)
        
        let data = {
            total: parseInt(total_yes_amount.rows[0].sum) + parseInt(total_no_amount.rows[0].sum),
            yes: total_yes_amount.rows[0].sum,
            no: total_no_amount.rows[0].sum,
        }
        return res.status(200).json({data, yes_stats, no_stats})
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
});

// betting on event
router.post('/bet', authorization, async(req, res)=>{
    const { bet_amount, event_id, is_yes } = req.body
    try {
        await addUserScore(event_id, req.user_id, is_yes) 

        const event = await db.query('SELECT e_end, is_approved FROM EVENTS WHERE _id = $1', [
            event_id
        ]);

        const betNumbers = await db.query('SELECT min_bet, max_bet FROM NUMBERS')
        if(parseInt(bet_amount) < parseInt(betNumbers.rows[0].min_bet) || parseInt(bet_amount) > parseInt(betNumbers.rows[0].max_bet))
            return res.status(422).json({message: `Bet should be greater than ${betNumbers.rows[0].min_bet} and less than ${betNumbers.rows[0].max_bet} PICKS.`})

        // Check if event end time has passed
        const eventEnd = new Date(event.rows[0].e_end);
        if (eventEnd < new Date()) 
            return res.status(422).json({ message: 'Event timeline passed.' });

        const user = await db.query('SELECT balance, bet_amount FROM USERS WHERE _id = $1', [
            req.user_id
        ])

        // check user has placed bet already
        const bet = await db.query('SELECT * FROM BETTING WHERE e_id = $1 AND u_id = $2',[
            event_id, req.user_id
        ])
        if(bet.rows.length > 0)
            return res.status(422).json({message: 'You have already placed a bet.'})

        if(parseInt(user.rows[0].balance) >= parseInt(bet_amount)){
            // placing bet
            await db.query('INSERT INTO BETTING(e_id, u_id, bet_amount, is_yes) VALUES($1, $2, $3, $4)',[
                event_id, req.user_id, bet_amount, is_yes,
            ])

            const updated_balance = parseInt(user.rows[0].balance) - parseInt(bet_amount)
            const updated_bet_amount = parseInt(user.rows[0].bet_amount) + parseInt(bet_amount)
            
            // updating user balance
            await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3',[
                updated_balance, updated_bet_amount, req.user_id
            ])
            

            return res.status(200).json({message: 'Bet placed successfully.'})
        }
        else
            return res.status(422).json({message:'Insufficient balance.'})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// cancel bet
router.delete('/bet/:event_id', authorization, async(req, res)=> {
    try {
        // Check if event end time has passed
        const event = await db.query('SELECT e_end FROM EVENTS WHERE _id = $1', [
            req.params.event_id
        ]);
        const eventEnd = new Date(event.rows[0].e_end);
        if (eventEnd < new Date()) 
            return res.status(422).json({ message: 'Bets can be cancelled before participation time.' });
    
        await removeUserScores(req.params.event_id, req.user_id)

        const bet = await db.query('SELECT bet_amount FROM BETTING WHERE e_id = $1 AND u_id = $2',[
            req.params.event_id, req.user_id
        ])
        if(bet.rows.length === 0)
            return res.status(422).json({message: 'No bet is placed yet.'})
        
        const user = await db.query('SELECT balance, bet_amount FROM USERS WHERE _id = $1', [
            req.user_id
        ])
        const updated_balance = parseInt(user.rows[0].balance) + parseInt(bet.rows[0].bet_amount)
        const updated_bet_amount = parseFloat(user.rows[0].bet_amount) - parseInt(bet.rows[0].bet_amount)

        await db.query('DELETE FROM BETTING WHERE e_id = $1 AND u_id = $2',[
            req.params.event_id, req.user_id
        ])

         // updating user balance
        await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3',[
            updated_balance, updated_bet_amount, req.user_id
        ])

        return res.status(200).json({message: 'Bet canceled successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// my bet
router.get('/my-bet/:event_id', authorization, async(req, res) => {
    try {
        const myBet = await db.query('SELECT bet_amount FROM BETTING WHERE u_id = $1 AND e_id = $2', [req.user_id, req.params.event_id])
        return res.status(200).json(myBet.rows[0]?.bet_amount ? myBet.rows[0].bet_amount : 0)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// potential return calculate onChange
router.post('/potential-return/:event_id', async(req, res) => {
        const { value } = req.body;
    try {

        const total_volume = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [req.params.event_id])
        const percent_100 = parseInt(total_volume.rows[0].sum) + parseInt(value)
        const percent_1 = parseFloat(percent_100 / 100)
        const percent_99 = parseFloat(percent_100 - percent_1)
        
        const yesBets = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = 1 AND e_id = $1', [req.params.event_id])
        const noBets = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [req.params.event_id])

        const sum_of_yes_bets = parseInt(yesBets.rows[0].sum) + parseInt(value)
        const sum_of_no_bets = parseInt(noBets.rows[0].sum) + parseInt(value)
        const yes_return = parseFloat(percent_99 * (parseInt(value) / sum_of_yes_bets))
        const no_return =  parseFloat(percent_99 * (parseInt(value) / sum_of_no_bets))

        return res.status(200).json({yes: yes_return, no: no_return})


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to approve 
router.patch('/approve/:id', authorization, onlyAdmin, async(req, res)=>{
    try {

        const approval_amount = 100

        // checking admin has enough balance
        const admin = await db.query('SELECT balance, bet_amount FROM USERS WHERE _id = $1',[
            req.user_id
        ])

        if(parseInt(admin.rows[0].balance) < approval_amount)
            return res.status(422).json({message: 'You have insufficient balance'})


        // approving event
        await db.query('UPDATE EVENTS SET is_approved = 1, is_active = 1 WHERE _id = $1',[
            req.params.id
        ])

        // 50 to YES and 50 to NO
        // to NO
        await db.query('INSERT INTO BETTING(e_id, u_id, bet_amount, is_yes) VALUES($1, $2, $3, $4)',[
            req.params.id, req.user_id, (approval_amount/2), 0
        ])
        // to YES
        await db.query('INSERT INTO BETTING(e_id, u_id, bet_amount, is_yes) VALUES($1, $2, $3, $4)',[
            req.params.id, req.user_id, (approval_amount/2), 1
        ])

        // updaing admin's balance
        const admin_remaining_balance = parseFloat(admin.rows[0].balance) - approval_amount

        // update admin's bet_amount
        const admin_bet_amount = parseFloat(admin.rows[0].bet_amount) + approval_amount

        await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3',[
            admin_remaining_balance, admin_bet_amount, req.user_id
        ])

        return res.status(200).json({message: 'Event approved successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to deactivate
router.patch('/deactivate/:id', authorization, onlyAdmin, async(req, res)=> {
    try {
        await db.query('UPDATE EVENTS SET is_active = 0 WHERE _id = $1', [req.params.id])
        return res.status(200).json({message: 'Event is hidden from service page.'});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to activate
router.patch('/activate/:id', authorization, onlyAdmin, async(req, res)=> {
    try {
        await db.query('UPDATE EVENTS SET is_active = 1 WHERE _id = $1', [req.params.id])
        return res.status(200).json({message: 'Event is live on service page.'});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// delete event
router.delete('/delete/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        const event = await db.query('SELECT image_CID, content_CID, is_active FROM EVENTS WHERE _id = $1', [req.params.id])
        
        if(event.rows[0].is_active == 1){
            return res.status(422).json({message: 'Event is live.'})
        }

        await deleteFromIPFS(event.rows[0].content_cid)

        await db.query('DELETE FROM EVENTS WHERE _id = $1', [req.params.id])

        return res.status(200).json({message: 'Event deleted successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// user to get his participated events
router.get('/participated', authorization, async(req, res) => {
    let { title, status, category } = req.query
    try {
        let events = []
        let participatedEvents
        let createdEvents
        let favouriteEvents

        participatedEvents = await db.query(`SELECT EVENTS._id, address as creator, e_start, image_cid, pick, BETTING.created_on, EVENTS.title, BETTING.bet_amount, BETTING.is_yes, EVENTS.is_active, EVENTS.executed_as FROM BETTING 
                                            INNER JOIN EVENTS
                                                ON BETTING.e_id = EVENTS._id
                                            INNER JOIN CATEGORIES 
                                                ON CATEGORIES._id = EVENTS.c_id 
                                            INNER JOIN USERS
                                                ON USERS._id = EVENTS.creator_id
                                                WHERE u_id = $1 AND EVENTS.is_active != 3`, [req.user_id])

        createdEvents = await db.query(`SELECT EVENTS._id, address as creator, e_start, image_cid, pick, EVENTS.created_on, EVENTS.title, EVENTS.is_active, EVENTS.executed_as FROM EVENTS
                                                INNER JOIN CATEGORIES
                                                    ON CATEGORIES._id = EVENTS.c_id 
                                                INNER JOIN USERS
                                                    ON USERS._id = EVENTS.creator_id
                                                    WHERE creator_id = $1 AND EVENTS.is_active != 3`, [req.user_id])  

        favouriteEvents = await db.query(`SELECT EVENTS._id, address as creator, e_start, image_cid, pick, FAVOURITE.created_on, EVENTS.title, EVENTS.is_active, EVENTS.executed_as FROM EVENTS
                                                INNER JOIN CATEGORIES
                                                    ON CATEGORIES._id = EVENTS.c_id 
                                                INNER JOIN FAVOURITE 
                                                    ON EVENTS._id = FAVOURITE.e_id
                                                INNER JOIN USERS
                                                    ON USERS._id = EVENTS.creator_id
                                                    WHERE FAVOURITE.u_id = $1 AND EVENTS.is_active != 3`, [req.user_id])  
        
                                                
        // favourite events
        for (let i = 0; i < favouriteEvents.rows.length; i++) {
            favouriteEvents.rows[i].is_favourite = true;
            events.push(favouriteEvents.rows[i])
            
        }

        // calculate 1%
        for (let i = 0; i < createdEvents.rows.length; i++) {
            const total_volume = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [createdEvents.rows[i]._id])
            const percent_1 = parseFloat(total_volume.rows[0].sum)/100
            createdEvents.rows[i].created_outcome = percent_1
            createdEvents.rows[i].is_created = true
            events.push(createdEvents.rows[i])
        }  
        
        
        // calculte my bet outcome
        for (let i = 0; i < participatedEvents.rows.length; i++) {
            const total_volume = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [participatedEvents.rows[i]._id])
            const percent_1 = parseFloat(total_volume.rows[0].sum)/100
            const left_volume = parseFloat(total_volume.rows[0].sum) - parseFloat(percent_1)

            const sum_of_winners_bet = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1 AND is_yes = $2', [participatedEvents.rows[i]._id, participatedEvents.rows[i].is_yes])

            let user_return = parseFloat(left_volume) * (parseFloat(participatedEvents.rows[i].bet_amount) / parseFloat(sum_of_winners_bet.rows[0].sum))
            

            let executed_as = participatedEvents.rows[i].executed_as;
            let is_yes = participatedEvents.rows[0].is_yes;

            if(executed_as == -1)
                participatedEvents.rows[i].bet_outcome = user_return.toString()
            else{
                participatedEvents.rows[i].bet_outcome = (executed_as == is_yes) ? user_return.toString() : "0"
            }
            
            participatedEvents.rows[i].is_betted = true
            events.push(participatedEvents.rows[i])
        }



        let filtered_events = []
        // filter created events
        for (let i = 0; i < events?.length; i++) {
            let event = createdEvents.rows?.filter(obj => obj?._id === events[i]?._id)[0]
            
           

            if (event) {
                const result_decided = await db.query('SELECT * FROM EVENT_EXECUTION WHERE e_id = $1', [event?._id])
                if(result_decided.rows.length === 0){
                    event.result_decided = false;
                }
                else{
                    event.result_decided = true;
                    event.will_exeute_as = result_decided.rows[0].will_exeute_as
                }

                event = {
                    ...event,
                    is_created: true,
                    is_betted: false,
                    is_favourite: false,
                    is_yes: null,
                    bet_amount: 0,
                    bet_outcome: null
                };
                // check participated_created has already that event ?
                const check = filtered_events.filter((obj) => obj?._id === event._id)[0]
                if(check){
                    check.is_created = true
                    check.is_betted = false
                    check.is_favourite = false
                    check.is_yes = null
                    check.bet_amount = 0
                    check.bet_outcome = null
                }
                else
                    filtered_events.push(event);
            }
        }

        // filter bet_events
        for (let i = 0; i < events?.length; i++) {
            let event = participatedEvents?.rows?.filter(obj => obj?._id === events[i]?._id)[0]

            
            if(event){
                const result_decided = await db.query('SELECT * FROM EVENT_EXECUTION WHERE e_id = $1', [event._id])
                if(result_decided.rows.length === 0){
                    event.result_decided = false;
                }
                else{
                    event.result_decided = true;
                    event.will_exeute_as = result_decided.rows[0].will_exeute_as
                }

                event = {
                    ...event,
                    is_betted: true,
                    is_favourite: false
                };

                // check participated_created has already that event ?
                const check = filtered_events.filter((obj) => obj._id === event._id)[0]
                if(check){
                    check.is_betted = true
                    check.is_favourite = false
                    check.is_yes = event.is_yes
                    check.executed_as = event.executed_as
                    check.bet_amount = event.bet_amount
                    check.bet_outcome = event.bet_outcome
                }
                else
                    filtered_events.push(event)
            }
        }


        // filter favourite_events
        for (let i = 0; i < events?.length; i++) {
            let event = favouriteEvents?.rows?.filter(obj => obj?._id === events[i]?._id)[0]
            
            
            if(event){
                const result_decided = await db.query('SELECT * FROM EVENT_EXECUTION WHERE e_id = $1', [event._id])
                if(result_decided.rows.length === 0){
                    event.result_decided = false;
                }
                else{
                    event.result_decided = true;
                    event.will_exeute_as = result_decided.rows[0].will_exeute_as
                }
                
                event = {
                    ...event,
                    is_favourite: true,
                    is_created : false,
                    is_betted : false,
                    is_yes : null,
                    bet_amount : 0,
                    bet_outcome : null,
                    // exceuted_as
                };

                // check participated_created has already that event ?
                const check = filtered_events.filter((obj) => obj._id === event._id)[0]
                if(check){
                    check.is_favourite = true
                    is_created = false
                    is_betted = false
                    is_yes = null
                    bet_amount = 0
                    bet_outcome = null
                    // exceuted_as
                }
                else
                    filtered_events.push(event)
            }
        }



        // calculate outcome and no_bet_percentage
        for (let i = 0; i < filtered_events.length; i++) {
            let bet_amount = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [filtered_events[i]._id])
            let no_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [filtered_events[i]._id])
            let no_bet_percentage = (parseInt(no_bet_voloume.rows[0].sum) * 100 / parseInt(bet_amount.rows[0].sum))
            filtered_events[i].no_bet_percentage = no_bet_percentage

            let bet_outcome = filtered_events[i].bet_outcome? filtered_events[i].bet_outcome : 0
            let created_outcome = filtered_events[i].created_outcome? filtered_events[i].created_outcome : 0

            filtered_events[i].outcome = parseFloat(bet_outcome) + parseFloat(created_outcome)
            
        }

        return res.json(filtered_events)
        let data = events
        if(title != "null"){
          data = events.filter((event) =>
            event.title.toLowerCase().includes(title.toLocaleLowerCase())
            );}
        
        if(category == 0){
            status = 2
        }
        
        if(status == 2){
            category = 0
        }

        if(status != 2){
            data = events.filter(event => event.is_active == status)
            data.sort((a, b) => {return b.created_on - a.created_on})
            return res.status(200).json(data)
            console.log('cond 1');
        }
        else if(category != 0){
            data = events.filter(event => event.c_id == category)
            data.sort((a, b) => {return b.created_on - a.created_on})
            return res.status(200).json(data)
            console.log('cond 2');
        }
        else if(status == 2 || category == 0){
            data = events
            console.log("cond 3");
        }
        else{
            data = events
            console.log('cond 4');
        }
        data.sort((a, b) => {return b.created_on - a.created_on})
    
        return res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin to execute
router.patch('/execute', authorization, onlyAdmin, async(req, res) => {
    const { event_id, is_yes } = req.body
    try {
        // check if event deadline passed
        const event = await db.query('SELECT e_start, is_active FROM EVENTS WHERE _id = $1',[event_id])
        if(event.rows.length === 0)
            return res.status(404).json({message: 'Event not found.'})
        if(event.rows[0].is_active == -1)
            return res.status(422).json({message: 'Event executed already.'})

        if(new Date(event.rows[0].e_start) > new Date())
            return res.status(422).json({message: 'Event has not passed its D-date.'})

        const bettings = await db.query('SELECT u_id, bet_amount, is_yes FROM BETTING WHERE e_id = $1', [event_id])
        const total_volume = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [event_id])
        const creator_id = await db.query('SELECT creator_id FROM EVENTS WHERE _id = $1', [event_id])

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
        const sum_of_winners_bet = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE is_yes = $1 AND e_id = $2', [is_yes, event_id])

        for (let i = 0; i < usersWhoBetRight.length; i++) {
                let user_return = parseFloat(left_volume) * (parseFloat(usersWhoBetRight[i].bet_amount) / parseFloat(sum_of_winners_bet.rows[0].sum))

                const user = await db.query('SELECT balance, earned_amount, bet_amount FROM USERS WHERE _id = $1', [usersWhoBetRight[i].u_id])

                const updated_user_balance = parseFloat(user_return) + parseFloat(user.rows[0].balance)
                const updated_earned_amount = parseFloat(user_return) + parseFloat(user.rows[0].earned_amount)
                const updated_bet_amount = Math.abs(parseFloat(user.rows[0].bet_amount) - parseFloat(usersWhoBetRight[i].bet_amount))

                await db.query('UPDATE USERS SET balance = $1, earned_amount = $2, bet_amount = $3 WHERE _id = $4', [
                    updated_user_balance, updated_earned_amount, updated_bet_amount, usersWhoBetRight[i].u_id
                ])
        }

        for (let i = 0; i < usersWhoBetWrong.length; i++) {
                const user = await db.query('SELECT bet_amount, lost_amount FROM USERS WHERE _id = $1', [usersWhoBetWrong[i].u_id])
                const updated_lost_amount = parseFloat(user.rows[0].lost_amount) + parseFloat(usersWhoBetWrong[i].bet_amount)
                const updated_bet_amount = Math.abs(parseFloat(user.rows[0].bet_amount) - parseFloat(usersWhoBetWrong[i].bet_amount))

                await db.query('UPDATE USERS SET bet_amount = $1, lost_amount = $2 WHERE _id = $3', [
                    updated_bet_amount, updated_lost_amount, usersWhoBetWrong[i].u_id
                ])
        }

        await db.query('UPDATE EVENTS SET executed_as = $1, is_active = -1 WHERE _id = $2', [is_yes, event_id])

        return res.status(200).json({message: 'Event executed successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// add to favourite
router.post('/favourite', authorization, async(req, res) => {
    const { event_id } = req.body
    try {
        const check = await db.query('SELECT * FROM FAVOURITE WHERE e_id = $1 AND u_id = $2',[event_id, req.user_id])
        if(check.rows.length > 0){
            await db.query('DELETE FROM FAVOURITE WHERE e_id = $1 AND u_id = $2',[event_id, req.user_id])
            return res.status(200).json({message:'Removed from favorites.'})
        }
        await db.query('INSERT INTO FAVOURITE(e_id, u_id) VALUES($1, $2)', [event_id, req.user_id])
        return res.status(200).json({message:'Saved to favorites.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin listing events
router.get('/admin/event-listing', authorization, onlyAdmin, async(req, res) => {
    try {
        const events = await db.query('SELECT _id, title, views, e_start, pick, image_CID, is_active, is_approved, created_on FROM EVENTS')
        for (let i = 0; i < events.rows?.length; i++) {
            const bet_amount = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            const responses = await db.query('SELECT COUNT(*) FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            events.rows[i].bet_amount = bet_amount.rows[0].sum? bet_amount.rows[0].sum : 0
            events.rows[i].responses = responses.rows[0].count
        }

        for (let i = 0; i < events.rows.length; i++) {
            let bet_amount = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE e_id = $1', [events.rows[i]._id])
            let no_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 0 AND e_id = $1', [events.rows[i]._id])
            let no_bet_percentage = (parseInt(no_bet_voloume.rows[0].sum) * 100 / parseInt(bet_amount.rows[0].sum))
            events.rows[i].no_bet_percentage = no_bet_percentage
            
        }

        return res.status(200).json(events.rows.sort((a,b) => b.created_on - a.created_on))
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// admin single event
router.get('/admin/single/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        const event = await db.query('SELECT EVENTS._id, title, pick, description, e_start, content_CID, image_CID, executed_as, EVENTS.is_active, is_approved, address, name FROM EVENTS INNER JOIN CATEGORIES ON EVENTS.c_id = CATEGORIES._id INNER JOIN USERS ON Events.creator_id = USERS._id WHERE EVENTS._id = $1', [req.params.id])
        
        const bet_amount = await db.query('SELECT SUM(bet_amount) FROM BETTING WHERE e_id = $1', [req.params.id])
        const responses = await db.query('SELECT COUNT(*) FROM BETTING WHERE e_id = $1', [req.params.id])
        event.rows[0].bet_amount = bet_amount.rows[0].sum? bet_amount.rows[0].sum : 0
        event.rows[0].responses = responses.rows[0].count

        let yes_bet_voloume = await db.query('SELECT sum(bet_amount) FROM BETTING WHERE is_yes = 1 AND e_id = $1', [req.params.id])

        let yes_bet_percentage = (parseInt(yes_bet_voloume.rows[0].sum) * 100 / parseInt(bet_amount.rows[0].sum))
        event.rows[0].yes_bet_percentage = yes_bet_percentage
        event.rows[0].no_bet_percentage = 100 - yes_bet_percentage


        return res.status(200).json(event.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// cancel event
router.patch('/admin/cancel/:id', authorization, onlyAdmin, async(req, res) => {
    try {
        const bets = await db.query('SELECT u_id, bet_amount FROM BETTING WHERE e_id = $1', [req.params.id])
        for (let i = 0; i < bets.rows.length; i++) {
            const user = await db.query('SELECT bet_amount, balance FROM USERS WHERE _id = $1', [bets.rows[i].u_id])
            let updated_balance = parseFloat(user.rows[0].balance) + parseFloat(bets.rows[i].bet_amount)
            let updated_bet_amount = parseFloat(user.rows[0].bet_amount) - parseFloat(bets.rows[i].bet_amount)
            await db.query('UPDATE USERS SET balance = $1, bet_amount = $2 WHERE _id = $3', [updated_balance, updated_bet_amount, bets.rows[i].u_id])
        }
        await db.query('DELETE FROM BETTING WHERE e_id = $1', [req.params.id])
        await db.query('UPDATE EVENTS SET is_active = 0 WHERE _id = $1', [req.params.id])

        return res.status(200).json({message:'Event cancelled successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// report event
router.patch('/report/:id', authorization, async(req, res) => {
    try {
        // if event particapation ends, accept no reports
        const event = await db.query('SELECT e_end, is_approved FROM EVENTS WHERE _id = $1', [
            req.params.id
        ]);

        const eventEnd = new Date(event.rows[0].e_end);
        if (eventEnd < new Date()) 
            return res.status(422).json({ message: 'No reports are allowed after participation time.' });

        // check user has already reported
        const check = await db.query('SELECT * FROM REPORTS_APPEAL WHERE e_id = $1 AND u_id = $2 AND reported = true', [req.params.id, req.user_id])

        if (check.rows.length !== 0)
            return res.status(422).json({ message: 'You have already reported this event.' });

        // insert new report
        await db.query('INSERT INTO REPORTS_APPEAL(u_id, e_id, reported) VALUES($1, $2, $3)', [req.user_id, req.params.id, true])

        const total_reports = await db.query('SELECT COALESCE(COUNT(*), 0) FROM REPORTS_APPEAL WHERE e_id = $1 AND reported = true', [req.params.id])

        if (total_reports.rows[0].count >= 5){
            // inactive event, hide from service page
            await db.query('UPDATE EVENTS SET is_active = 0 WHERE _id = $1', [req.params.id])
        }

        return res.status(200).json({message: 'Event reported successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// appeal
router.patch('/appeal/:id', authorization, async(req, res) => {
    try {
        // if event particapation ends, accept no reports
        const event = await db.query('SELECT e_end, is_approved FROM EVENTS WHERE _id = $1', [
            req.params.id
        ]);

        const eventEnd = new Date(event.rows[0].e_start);
        if (eventEnd > new Date()) 
            return res.status(422).json({ message: 'Appeal request are accepted after D-date' });

        // check user has already appealed
        const check = await db.query('SELECT * FROM REPORTS_APPEAL WHERE e_id = $1 AND u_id = $2 AND appealed = true', [req.params.id, req.user_id])

        if (check.rows.length !== 0)
            return res.status(422).json({ message: 'You have already reported this event.' });

        // insert new report
        await db.query('INSERT INTO REPORTS_APPEAL(u_id, e_id, reported) VALUES($1, $2, $3)', [req.user_id, req.params.id, true])

        const total_reports = await db.query('SELECT COALESCE(COUNT(*), 0) FROM REPORTS_APPEAL WHERE e_id = $1 AND reported = true', [req.params.id])

        if (total_reports.rows[0].count >= 5){
            // inactive event, hide from service page
            await db.query('UPDATE EVENTS SET is_active = 0 WHERE _id = $1', [req.params.id])
        }

        return res.status(200).json({message: 'Event reported successfully.'})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})

// add veiw
router.patch('/add-view/:id', async(req, res) => {
    try {
        const event = await db.query('SELECT views FROM EVENTS WHERE _id = $1', [req.params.id])

        let updated_views = parseInt(event.rows[0].views) + 1

        await db.query('UPDATE EVENTS SET views = $1 WHERE _id = $2', [updated_views, req.params.id])

        return res.status(200).json({})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})


// create decision
router.post('/decision', authorization, async(req, res) => {
    const { event_id, will_exeute_as } = req.body
    try {
        const event = await db.query('SELECT creator_id, e_start FROM EVENTS WHERE _id = $1', [event_id])

        if(event.rows[0].creator_id != req.user_id)
            return res.status(422).json({message: 'Only creator can decide the result.'})

        // decison can only be taken after d-date
        const eventEnd = new Date(event.rows[0].e_start);
        if (eventEnd > new Date()) 
            return res.status(422).json({ message: 'Decisions are allowed after D-date.' });


        await db.query('INSERT INTO EVENT_EXECUTION(e_id, will_exeute_as) VALUES($1, $2)', [event_id, will_exeute_as])
        return res.status(200).json({})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Server Error'})
    }
})



module.exports = router