const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PORT = 8001;
const { Users, Todos } = require('./db');
app.use(express.json());

// new users input validation
const { validNewUserInput, validUserInput } = require('./validateUser')
// user exist in database
async function userExist(email, pass) {
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
app.post('/signup', validNewUserInput, async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.pass;
    if (!await userExist(email, pass)) {
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
    else {
        res.status(409).json({
            msg: "user already exist please login"
        })
    }
})

// user login route
app.post('/login', validUserInput, (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const token = jwt.sign({ username, email }, process.env.SECRET_KEY);
    console.log(token);
    res.status(200).json({
        msg: "logged in successfully"
    })
})


// Create Todo
app.post('/create-todo', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const emailExist = await Users.findOne({
            email: decoded.email
        })
        if (emailExist === null) {
            console.log("check email in db")
            res.status(403).json({ msg: "unauthorised user" })
        }
        else {
            const todo = new Todos({
                title,
                description,
                user : emailExist._id
            });
            await todo.save();
            res.status(200).json({ msg: "todo created" });
        }
    }
    catch (err) {
        console.log("error while decoding")
        return res.status(403).json({ msg: "unauthorised user" })
    }

})

// Server listening
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})