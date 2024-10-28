const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.mongoURL);

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    pass: String
})

const todosSchema = new mongoose.Schema({
    title: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    }
});

const Todos = mongoose.model('todos', todosSchema);
const Users = mongoose.model('users', userSchema);
module.exports = {
    Users,
    Todos
}