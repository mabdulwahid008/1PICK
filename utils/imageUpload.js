const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './images')
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().getTime() + file.originalname )
    }
})


const imageUpload = multer({
    storage: storage,
})

module.exports = imageUpload;