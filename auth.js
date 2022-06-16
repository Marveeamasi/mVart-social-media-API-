const router = require("express").Router();
const User = require("../models/User");


//REGISTER
router.post("/register", async(req,res)=>{
 try{
  
  //create new user
const newUser = await new User({
  username:req.body.username,
  email:req.body.email,
  password:req.body.password
  
})
//send responds
const user = await newUser.save();
res.status(200).json(user);
  
}catch(err){
  res.status(500).send(err);
}

});



//LOGIN
router.post("/login", async(req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    !user && res.status(404).json("User not found");

   const validP = await User.findOne({password:req.body.password});
   !validP && res.status(404).json("wrong password");
   
   res.status(200).json(user);
   
  } catch(err) {
    res.status(500).send(err);
  }
  
});

module.exports = router;