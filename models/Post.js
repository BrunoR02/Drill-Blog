const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Posts = new Schema({
    title: String,
    slug: String,
    filename: String,
    img:{
        data: Buffer,
        contentType: String
    },
    desc: String,
    content: String,
    data:{
        type: Number,
        default: Date.now()
    }

})

module.exports = mongoose.model("posts", Posts)