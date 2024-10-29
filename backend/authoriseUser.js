const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Users, Todos } = require('./db');

async function authoriseUser(req,res,next){
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        res.locals.emailExist = await Users.findOne({
            email: decoded.email
        })
        if (res.locals.emailExist === null) {
            res.status(403).json({ msg: "unauthorised user" })
        }
        else {
            next();
        }
    }
    catch (err) {
        console.log(err)
        return res.status(403).json({ msg: "unauthorised user" })
    }
}
module.exports = authoriseUser