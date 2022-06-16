const router = require("express").Router();
const User = require("../models/User");

//UPDATE User
router.put("/:id", async(req,res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
   try{ 
    const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body,
      
    });
    res.status(200).json(user)
   }catch(err){
     return res.status(500).json(err);
   }
  }else{
    return res.status(403).json("you can update only your account ");
  }
  
});

//DELETE User

router.delete("/:id", async(req,res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
   try{ 
   await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("user deleted successfully");
   } catch(err) {
     return res.status(500).json(err);
   }
  }else{
    return res.status(403).json("you can delete only your account ");
  }
  
});


//GET A USER
router.get("/:id",async(req,res)=>{
  try{
  const user = await User.findById(req.params.id);
  const{password,updatedAt,...others}=user._doc
  res.status(200).json(others);
  } catch(err){
    res.status(500).json(err);
  }
});


//FOLLOW USER
router.put("/:id/follow", async(req,res)=>{
  if(req.body.userId!==req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const curUser = await User.findById(req.body.userId);
      if(!user.followers.includes(req.body.userId)){
        await user.updateOne({$push:{followers:req.body.userId}});
        await curUser.updateOne({$push:{following:req.params.id}});
        res.status(200).json("user has been followed");
      }else{
        res.status(403).json("you already follow this user");
      }
        
      
    }catch(err){
      res.status(500).send(err);
    }
  }
  else{
    res.status(403).send("you can't follow your self");
  }
});


//UNFOLLOW USER
router.put("/:id/unfollow", async(req,res)=>{
  if(req.body.userId!==req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const curUser = await User.findById(req.body.userId);
      if(user.followers.includes(req.body.userId)){
        await user.updateOne({$pull:{followers:req.body.userId}});
        await curUser.updateOne({$pull:{following:req.params.id}});
        res.status(200).json("user has been unfollowed");
      }else{
        res.status(403).json("you haven't followed this user");
      }
        
      
    }catch(err){
      res.status(500).send(err);
    }
  }
  else{
    res.status(403).send("you can't unfollow your self");
  }
});



module.exports = router;