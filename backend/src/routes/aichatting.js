const express=require('express');
const userMiddleware = require('../middleware/usermiddleware');
const solveDoubt = require('../controllers/solvedoubt');
const aiRouter=express.Router();

aiRouter.post('/chat',userMiddleware,solveDoubt);

module.exports=aiRouter;