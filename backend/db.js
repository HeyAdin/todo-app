const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.mongoURL);

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    pass : String
})

const users = mongoose.model('users',userSchema);
module.exports = {
    users
}