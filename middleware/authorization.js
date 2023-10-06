const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorization = async(req, res, next) => {
    try {
        const token = req.header('token')
        
        if(!token)
            return res.status(401).json({})

        try {
            const decodedToken = jwt.verify(token, process.env.SECERET_KEY)
            req.user_id = decodedToken.user_id
            req.is_admin = decodedToken.user_is_admin
            next();
          } catch (error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
              return res.status(401).json({ message: 'Token has expired' })
            }
            throw error;
          }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
}

module.exports = authorization