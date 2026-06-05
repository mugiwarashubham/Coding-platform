const express=require('express');
const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminmiddleware")
const userMiddleware=require("../middleware/usermiddleware")
const  {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require("../controllers/userproblem")


//problem create karna 
problemRouter.post("/create",adminMiddleware,createProblem);
//problem update
problemRouter.put('/update/:id',adminMiddleware,updateProblem);
//problem delete
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);
//problem fetch
//particular problem
problemRouter.get('/problemById/:id',userMiddleware,getProblemById);
//saari problem
problemRouter.get('/getAllProblem',userMiddleware,getAllProblem)
//problem solved by user
problemRouter.get('/problemSolvedByUser',userMiddleware,solvedAllProblembyUser);
//submission tag
problemRouter.get('/submittedProblem/:pid',userMiddleware,submittedProblem);

module.exports=problemRouter;

