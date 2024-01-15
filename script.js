const express= require("express")
const app = express()
const path= require("path")
const mongoose =require("mongoose");
const session = require('express-session')
const User =require("./model/user");
const Blog = require("./model/blogs");
app.use(session({
    secret: 'secret',
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true }
  }))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","hbs");

function checkIsLoggedIn(req,res,next){
    if(req.session.isLoggedIn){
        next();
    }else{
        res.redirect("/login");
    }

}
app.get("/",checkIsLoggedIn,(req,res)=>{
    res.render("home",{user:req.session.user});
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/dashboard", (req,res) => {
    res.render("dashboard",{user:req.session.user});
})
// app.get("/allblogs", (req,res) => {
//     res.render("allblogs");
// })
// app.get("/myblog", (req,res) => {
//     res.render("myblog");
// })
app.get("/home", (req,res) => {
    res.render("home");
})
app.post("/register",async(req,res)=>{
    const {username,password}=req.body;
    let newUser =new User({username,password});
    await newUser.save();
    // res.send("user registered successfully!!");
    res.redirect("/login");
})
app.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    let user=await User.findOne({username:username});
    if(user){
        if(user.password!=password){
            res.send("Invalid password!!")
        }else{
            req.session.isLoggedIn=true;
            req.session.user=user;
            res.redirect("/");
        }

    }else{
        res.send("user not found!!");
    }
})

app.post("/addblog", async (req,res)=> {
    const {postName,caption,blog} = req.body;
    let newblog = new Blog({postName,caption,blog,user:req.session.user._id});
    await newblog.save();
    let user = await User.findById(req.session.user._id);
    user.blogs.push(newblog._id);
    await user.save();
    console.log(user);
    console.log(newblog);
    res.redirect("/");
})

app.get("/myblog", async (req,res) => {
    let user = await User.findById(req.session.user._id).populate("blogs");
    console.log(user);
    res.render("myblog",{blogs:user.blogs,user:user});
})

app.get("/allblogs", async (req,res) => {
    const blogs = await Blog.find().populate("user");
    console.log(blogs);
    res.render("allblogs",{blogs});
})

mongoose.connect("mongodb://127.0.0.1:27017/BlogDB").then(()=>{
    app.listen(3334,()=>{
        console.log("server started at port 3334");
    })
})
