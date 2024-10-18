const zod = require('zod');

// user signup schema
const newUserSchema = zod.object({
    username : zod.string(),
    email : zod.string().email(),
    pass : zod.string().min(8).max(20)
})

// user login schema
const userSchema = zod.object({
    email : zod.string().email(),
    pass : zod.string().min(5).max(8)
})


module.exports = {
    newUserSchema,
    userSchema
}