const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema({
    name: String,
    email: String,
    password: String,
    adminTrue: Number
})

module.exports = mongoose.model("users", User)