const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    postName:String,
    caption:String,
    blog:String
})

module.exports = mongoose.model("POSTS",postSchema);