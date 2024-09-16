// const express = require("express");
// const router = express.Router();

// const {getAllPost,postAddPost,getOnePost,deleteOnePost,putUpdatePost} = require("../controller/blogs");

// router.get("/",getAllPost);
// router.post("/",postAddPost);
// router.get("/:id",getOnePost);
// router.delete("/:id",deleteOnePost);
// router.put("/:id",putUpdatePost);

const express= require("express");
const router=express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto=require("crypto");
// const bcrypt=require("bcrypt");
const sendEmail=require("../utils/util");
const session = require('express-session')
const User =require("../model/user");
const Blog = require("../model/blogs");
const Token=require("../model/token");

function checkIsLoggedIn(req,res,next){
    if(req.session.isLoggedIn){
        next();
    }else{
        res.redirect("/login");
    }

}
router.get("/",checkIsLoggedIn,(req,res)=>{
    res.render("home",{user:req.session.user});
})
router.get("/login",(req,res)=>{
    res.render("login");
})
router.get("/register",(req,res)=>{
    res.render("register");
})
router.get("/dashboard", (req,res) => {
    res.render("dashboard",{user:req.session.user});
})
router.get("/home",(req,res)=>{
    res.render("home");
})
router.get("/home2", (req,res) => {
    res.render("home2");
})
// router.get("/" , (req,res) => {
//     res.render("home");
// })

router.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    let user=await User.findOne({username:username});
    if(user){
        if(user.password!=password){
            res.send("Invalid password!!")
        }
        if (!bcrypt.compareSync(password,user.password)) {
            req.session.isLoggedIn=true;
            req.session.user=user;
            res.render("home2");
        }

    }else{
        res.send("user not found!!");
    }
})

router.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    console.log(email);
    bcrypt.hash(password, saltRounds).then(async function(hash) {
        // Store hash in your password DB.
        const newUser=new User({username,email,password:hash});
        await newUser.save();
        let newtoken = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const message = `${process.env.BASE_URL}/blogit/verify/${newUser.id}/${newtoken.token}`;
          await sendEmail(newUser.email, "Verify Email", message);
          res.send("verify your email by clicking link send to your email");
    });

})


router.get("/verify/:id/:token",async(req,res)=>{
    try {
        const {id}=req.params;
        let user= await User.findOne({_id:id});
        if(!user) return res.status(400).send("Invalid link");
    
        let token=await Token.findOne({userId:id,token:req.params.token});
        if(!token) return res.status(400).send("Invalid link");
        // await User.updateOne({_id:user.id,verify:true});
        user.isVerify=true;
        await user.save();
        await Token.findByIdAndDelete(token._id);
        res.redirect("/blogit/home");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addblog", async (req,res)=> {
    const {postName,caption,blog} = req.body;
    let newblog = new Blog({postName,caption,blog,user:req.session.user._id});
    await newblog.save();
    let user = await User.findById(req.session.user._id);
    user.blogs.push(newblog._id);
    await user.save();
    console.log(user);
    console.log(newblog);
    res.redirect("dashboard");
})

router.get("/myblog", async (req,res) => {
    let user = await User.findById(req.session.user._id).populate("blogs");
    console.log(user);
    res.render("myblog",{blogs:user.blogs,user:user});
})

router.get("/allblogs", async (req,res) => {
    const blogs = await Blog.find().populate("user");
    console.log(blogs);
    res.render("allblogs",{blogs});
})


router.get("/logout", (req,res) => {
    req.session.destroy(() => {
        res.render("home");
    });
})

router.get("/approvals", async (req,res) => {
    const blogs = await Blog.find({isVerified:false});
    res.render("approval",({blogs}));
})

router.get("/approve/:id", async (req,res) => {
    const id=req.params.id;
    const verified = await Blog.findById(id);
    verified.isVerified = true;
    await verified.save();
    res.render("home2");
})

router.get("/reject/:id", async (req,res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.render("home2");
})


module.exports = router;