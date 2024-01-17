require("dotenv").config();
console.log(process.env.USER);
console.log(process.env.PASS);
console.log(process.env.BASE_URL);
const express= require("express")
const app = express()
const path= require("path")
const mongoose =require("mongoose");
const session = require('express-session')
// const User =require("./model/user");
// const Blog = require("./model/blogs");
app.use(session({
    secret: 'secret',
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true }
}))
const PORT=process.env.PORT || 3334;
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","hbs");

app.use("/blogit",require("./routes/blogs"));
mongoose.connect("mongodb://127.0.0.1:27017/BlogDB").then(()=>{
    app.listen(PORT,()=>{
        console.log("server started at port : " + PORT);
    })
})
