const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE A Post
router.post("/", async(req,res)=>{
    const newPost = await new Post(req.body);
    try{
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  }catch(err){
    res.status(500).send(err);
  }
  
});

//UPDATE A Post
router.put("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId===req.body.userId){
      await post.updateOne({$set:req.body});
    res.status(200).json("post updated")
      
    }else{
      res.status(403).json("you can only update your post");
    }
  }catch(err){
    res.status(500).json(err);
  }
});

//DELETE A Post
router.delete("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId===req.body.userId){
      await post.deleteOne();
    res.status(200).json("post deleted")
      
    }else{
      res.status(403).json("you can only update your post");
    }
  }catch(err){
    res.status(500).json(err);
  }
});



//LIKE/DISLIKE A Post
router.put("/:id/like", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)){
      await Post.updateOne({$push:{likes:req.body.userId}});
      res.status(200).json("you just liked this post");
    }else{
      await Post.updateOne({$pull:{likes:req.body.userId}});
      res.status(200).json("post has been disliked")
    }
  }catch(err){
    res.status(500).json(err);
  }
});

//GET A POST
router.get("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  }catch(err){
    res.status(500).json(err);
  }
});

//GET TIMELINE POSTS
router.get("/timeline/all", async(req,res)=>{
  
  try{
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.followings.map((followUserId)=>{
     return  Post.find({userId: followUserId});
      }
    ));
    res.status(200).json(userPosts.concat(...friendPosts));
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;