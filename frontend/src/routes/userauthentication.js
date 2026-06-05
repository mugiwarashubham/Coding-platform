const express=require('express');
const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require('../controllers/userauthent')
const userMiddleware=require("../middleware/usermiddleware")
const adminMiddleware=require('../middleware/adminmiddleware')

//register
authRouter.post('/register',register);
//login
authRouter.post('/login',login);

//logout
authRouter.post('/logout',userMiddleware,logout);
//admin 
authRouter.post('/admin/register',adminMiddleware,adminRegister);
authRouter.delete('/profile',userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply={
        firstName: req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})

//getprofile
//authRouter.get('getProfile',getProfile);


module.exports= authRouter;
