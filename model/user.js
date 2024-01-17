const mongoose =require("mongoose");
const {Schema} = mongoose;

let userSchema= new mongoose.Schema({
    username:String,
    email: String,
    password:String,
    blogs:[{
        type:Schema.Types.ObjectId,
        ref:"POSTS"
    }],
    isVerify:{
        type:Boolean,
        default:false,
    },
    //    isAdmin:{
    //     type:Boolean , default:false,
    // }
})

module.exports= mongoose.model("User",userSchema);