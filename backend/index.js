const express = require('express')
const app = express();
const PORT = 8001;
const { Users, Todos } = require('./db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(express.json());
app.use(cors())
const authoriseUser = require('./authoriseUser');
// new users input validation
const { validNewUserInput, validUserInput } = require('./validateUser')
// user exist in database
async function userExist(email, pass) {
    const exist = await Users.findOne({
        email,
        pass
    })
    console.log("I am in userExist " + exist)
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
app.post('/login', validUserInput, async(req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    if(await userExist(email,pass)){
        const token = jwt.sign({ email }, process.env.SECRET_KEY);
        console.log("i am logging token " +token)
        res.status(200).json({
            msg: "logged in successfully",
            token
        })
    }
    else{
        res.status(403).json({msg : "user not found"});
    }
    
})


// Create Todo
app.post('/create-todo', authoriseUser, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const todo = new Todos({
        title,
        description,
        user: res.locals.emailExist._id
    });
    await todo.save();
    res.status(200).json({ msg: "todo created" });
});

// get all the todo for a user
app.get('/get-todo', authoriseUser, async (req, res) => {
    const todos = await Todos.find({
        user: res.locals.emailExist._id
    })
    console.log(todos)
    res.status(200).json({ allTodos: todos });

});

// deletes a todo 
app.delete('/delete-todo', authoriseUser, async (req, res) => {
    const todoId = req.body.todoId;
    console.log(todoId)
    const deletedTodos = await Todos.findOneAndDelete({ _id: todoId });
    console.log(deletedTodos);
    res.status(200).json({ msg: "todo deleted" })
});


app.put('/update-todo', authoriseUser, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const todoId = req.body.todoId;
    console.log(title,description,todoId)
    const updatedTodo = await Todos.findOneAndUpdate({_id : todoId},{
        title,
        description
    });
    console.log(updatedTodo);
    res.json({
        msg : "todo updated"
    })
    
})
// Server listening
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})