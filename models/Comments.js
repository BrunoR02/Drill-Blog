const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comments = new Schema({
    postRef: String,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    content: String,
    data: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model("comments", Comments)