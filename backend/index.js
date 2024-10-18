const express = require('express')
const app = express();
const PORT = 8001;
const { newUserSchema , userSchema } = require('./types');

app.use(express.json());

// new users input validation
function validNewUserInput(req,res,next){
    res.locals.username = req.body.username;
    res.locals.email = req.body.email;
    res.locals.pass = req.body.pass;
    const response = newUserSchema.safeParse({
        username :res.locals.username,
        email : res.locals.email,
        pass : res.locals.pass
    })
    if(response.success){
        next();
    }
    else{
        res.status(403).send("invalid input");
    }
}

// existing user input valid
function validUserInput(req,res,next){
    res.locals.email = req.body.email;
    res.locals.pass = req.body.pass;
    const response = userSchema.safeParse({
        email : res.locals.email,
        pass : res.locals.pass
    })
    if(response.success){
        next();
    }
    else{
        res.status(403).send("invalid input");
    }
}

// user signup route
app.post('/signup',validNewUserInput,(req,res)=>{
    
    console.log("created successfully");
    res.status(200).json({
        msg : {
            username : res.locals.username,
            email : res.locals.email
        }
    })
})

app.post('/login',validUserInput,(req,res)=>{
    console.log("login successful");
    res.status(200).json({
        msg: {
            email : res.locals.email,
            pass  : res.locals.pass
        }
    })
})

// Server listening
app.listen(PORT , ()=>{
    console.log(`server listening on ${PORT}`);
})