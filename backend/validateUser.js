const { newUserSchema, userSchema } = require('./types');

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

module.exports = {
    validNewUserInput,
    validUserInput
} 