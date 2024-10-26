const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PORT = 8001;
const { newUserSchema, userSchema } = require('./types');
const { Users } = require('./db');
app.use(express.json());

// new users input validation
function validNewUserInput(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.pass;
    const response = newUserSchema.safeParse({
        username,
        email,
        pass
    })
    if (response.success) {
        next();
    }
    else {
        res.status(403).send("invalid input");
    }
}

// existing user input valid
function validUserInput(req, res, next) {
    const email = req.body.email;
    const username = req.body.username;
    const pass = req.body.pass;
    console.log(username,email,pass);
    const response = userSchema.safeParse({
        email,
        pass
    })
    console.log(response.success);
    if (response.success) {
        next();
    }
    else {
        res.status(403).send("invalid input");
    }
}

// user exist in database
async function userExist(email,pass) {
    const exist = await Users.findOne({
        email,
        pass
    })

    if (exist === null) {
        return false;
    }
    else {
        return true;
    }
}
// user signup route
app.post('/signup', validNewUserInput, async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.pass;
    if(!await userExist(email,pass)){
        const user = new Users({
            username,
            email,
            pass
        })
        await user.save();
        res.status(200).json({
            msg: "user created successfuly"
        })
    }
    else{
        res.status(409).json({
            msg : "user already exist please login"
        })
    }
})

// user login route
app.post('/login', validUserInput, (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const token = jwt.sign({username,email},process.env.SECRET_KEY);
    console.log(token);
    res.status(200).json({
        msg: "logged in successfully"
    })
})



// Server listening
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})