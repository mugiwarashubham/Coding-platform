const redisClient = require('../config/redis');
const Submission = require('../models/submission');
const User=require('../models/user');
const validate=require('../utils/validator')
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const register= async(req,res)=>{
    try{
        //validate the data ;
        validate(req.body);
      const {firstName,emailId,password} = req.body;
     req.body.password = await bcrypt.hash(password,10);
     req.body.role='user'
  
     const user = await User.create(req.body);
      //token de rahe hai register karte hi 
     const token =  jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY ,{expiresIn:60*60});
      const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role

          }
     res.cookie('token',token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:'none'});
     res.status(201).json({
      user:reply,
      message:"user register Successfully"
     }); 
    }
    catch(err){
    console.log("REGISTER ERROR:", err.message);

    res.status(400).json({
        message: err.message
    });
}
}
const login=async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        if(!emailId)
            throw new Error("Invalid credentials");
        if(!password)
            throw new Error("Invalid credentials");
        //user ko dhund ke le aayega 
        const user = await User.findOne({emailId});
         if (!user) {
            throw new Error("User not found");
        }
        //verify kar rahe hai 
        const match = await bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("invalid credentials");
          const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
          }
         const token =  jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY ,{expiresIn:60*60});
          res.cookie('token',token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:'none'});
          res.status(201).json({
            user:reply,
            messsage:"Loggin Successfully"
          });
    }
    catch(err){
        res.status(401).send("Error"+err);
    }
}
const logout=async(req,res)=>{

    try{
     //validate the token
     //token addkardenge reddis mein blocklist 
     const {token}=req.cookies;
     const payload=jwt.decode(token);

     await redisClient.set(`token:${token}`,'Blocked');
     await redisClient.expireAt(`token:${token}`,payload.exp);
    //  //cookies clear
     res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true,secure:true,sameSite:'none'});
     res.send("logged out successfully");
    }
    catch(err){
      res.status(503).send("Error:"+err);
    }
}
const adminRegister=async(req,res)=>{
     try{
        //validate the data ;
        validate(req.body);
      const {firstName,emailId,password} = req.body;
     req.body.password = await bcrypt.hash(password,10);
  
     const user = await User.create(req.body);
      //token de rahe hai register karte hi 
     const token =  jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY ,{expiresIn:60*60});
     res.cookie('token',token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:'none'});
     res.status(201).send("Admin register successfully"); 
    }
    catch(err){
      res.status(400).send("Error"+err);
    } 
}
const deleteProfile=async(req,res)=>{
  try{
    const userId=req.result._id;

    //userschema se delete kardiya 
    User.findByIdAndDelete(userId);

    //submission waale kon bhi delete karna padega 
    // Submission.deleteMany({userId});

    res.status(200).send("deleted successfully");

  }
  catch(err){
    res.status(500).send("server error"+err.message);
  }
}
module.exports={register,login,logout,adminRegister,deleteProfile};