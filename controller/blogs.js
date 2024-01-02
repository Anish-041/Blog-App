// const blog = require("../model/blogs");
const Post = require("../model/blogs");

module.exports.getAllPost = async (req,res) => {
    let allPost = await Post.find({});
    res.json(allPost);
}

module.exports.postAddPost = async (req,res) => {
    const {postName,caption,blog} = req.body;
    let newPost = new Post({postName:postName,caption:caption,blog:blog});
    await newPost.save();
    res.send("Blog Added !!")
}

module.exports.getOnePost = async (req,res) => {
    const {id} = req.params;
    let post = await Post.findOne({_id:id});
    res.json(post);
}

module.exports.deleteOnePost = async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.send("Blog deleted");
}

module.exports.putUpdatePost = async(req,res) => {
    const{id} = req.params;
    let post = await Post.findById(id);
    const {postName,caption,blog} = req.body;
    console.log(post);
    post.postName = postName;
    post.caption = caption;
    post.blog = blog;
    await post.save();
    res.send("Blog updated");
}
