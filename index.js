const express = require('express')
const db = require('./db')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser');
const { filterEventsForTerminationAndCancellation } = require('./bots/filterEventsForTerminationAndCancellation');
const { cancelEvent } = require('./bots/cancelevent');

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '10mb' }));

db.connect((err)=>{
    if(err)
        console.log('Error while connecting to DB ', err);
    else
        console.log('Connected to DB');
})

// app.use(express.static(path.join(__dirname, "client/build")))
app.use('/images',express.static('images'))

app.use('/user', require('./routes/user'))
app.use('/category', require('./routes/categories'))
app.use('/event', require('./routes/event'))
app.use('/stats', require('./routes/stats'))
app.use('/comment', require('./routes/comments'))
app.use('/file', require('./routes/files'))

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", 'index.html'));
// });



app.listen(5000, ()=>{
    console.log('Server is listening on port 5000');
    // filterEventsForTerminationAndCancellation()
})