const mongoose =require("mongoose");
const {Schema} = mongoose;

let userSchema= new mongoose.Schema({
    username:String,
    password:String,
    blogs:[{
        type:Schema.Types.ObjectId,
        ref:"POSTS"
    }]
})

module.exports= mongoose.model("User",userSchema);