const express = require('express')
const router = express.Router()
const authorization = require('../middleware/authorization')
const db = require('../db')
const onlyAdmin = require('../middleware/onlyAdmin')

// get categories
router.get('/', async(req,res)=> {
    try {
        const categories = await db.query('SELECT _id, name, c_order, created_on FROM CATEGORIES ORDER BY c_order ASC')
        for (let i = 0; i < categories.rows.length; i++) {
            const eventCount = await db.query('SELECT COUNT(*) FROM EVENTS WHERE c_id = $1', [categories.rows[i]._id])
            categories.rows[i].eventCount = eventCount.rows[0].count
            
        }
        return res.status(200).json(categories.rows)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})
// Post category
router.post('/', authorization, onlyAdmin, async(req,res)=> {
    const { name } = req.body;
    try {
        await db.query('INSERT INTO CATEGORIES(name) VALUES($1)',[
            name
        ])

        const categories = await db.query('SELECT _id, name, c_order FROM CATEGORIES ORDER BY c_order ASC')
        
        return res.status(200).json({message:'Category added.', categories: categories.rows})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// Update category
router.patch('/', authorization, onlyAdmin, async(req,res)=> {
    const { _id, name, c_order } = req.body;
    try {
        await db.query('UPDATE CATEGORIES SET NAME = $1, c_order = $2 WHERE _id = $3',[
            name, c_order, _id
        ])

        const categories = await db.query('SELECT _id, name, c_order FROM CATEGORIES ORDER BY c_order ASC')
        
        return res.status(200).json({message:'Category Updated.', categories: categories.rows})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})

// delete category
router.delete('/:id', authorization, onlyAdmin, async(req,res)=> {
    try {
        await db.query('DELETE FROM CATEGORIES WHERE _id = $1',[
             req.params.id
        ])

        const categories = await db.query('SELECT _id, name FROM CATEGORIES ORDER BY c_order ASC')
        
        return res.status(200).json({message:'Category deleted.', categories: categories.rows})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message})
    }
})



module.exports = router