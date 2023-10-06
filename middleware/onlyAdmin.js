const onlyAdmin = async(req, res, next) => {
    if(!req.is_admin)
        return res.status(401).json({message: 'Unauthorized attempt.'})
    else
        next()
}

module.exports = onlyAdmin