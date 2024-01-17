const mongoose = require("mongoose");
const {Schema} = mongoose;
const postSchema = new mongoose.Schema({
    postName:String,
    caption:String,
    blog:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    isVerified:{type:Boolean,default:false},
})

module.exports = mongoose.model("POSTS",postSchema);