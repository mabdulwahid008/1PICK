const db = require('../db')
let notifications = []

const minifyAddress = (address) => {
    const start = address.substr(0, 6)
    const end = address.substr(address.length - 4)
    return `${start}...${end}`
}

exports.eventCreated = async(u_id, e_title, pick) => {
    const user = await db.query('SELECT address from USERS WHERE _id = $1', [u_id])

    notifications.push({
        text: `${e_title.substr(0, 20)}-${pick} by ${minifyAddress(user.rows[0].address)}`,
        by_admin: false
    })
}

exports.eventCanceled = async(e_id) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])

    notifications.push({
        text: `${event.rows[0].title.substr(0, 20)}-${event.rows[0].pick} - CANCELLED`,
        by_admin: false,
    })
}

exports.eventTerminated = async(e_id) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])

    notifications.push({
        text: `${event.rows[0].title.substr(0, 20)}-${event.rows[0].pick} - Terminated`,
        by_admin: false,
    })
}

exports.betOnEvent = async(u_id,e_id, amount, is_yes) => {
    const event = await db.query('SELECT title, pick FROM EVENTS WHERE _id = $1', [e_id])
    const user = await db.query('SELECT address from USERS WHERE _id = $1', [u_id])

    is_yes = is_yes == 1 ? '<span style="color:#00B66D">YES</span>' : '<span style="color:#FF385C">NO</span>'
    notifications.push({
        text: `${is_yes} <span style="font-weight:600">${amount}P</span> ${event.rows[0].title.substr(0, 20)} - ${event.rows[0].pick}`
    })

    console.log(notifications);
}