const { getLanguageById, submitBatch, submitToken } = require("../utils/problemutility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo=require("../models/solutionvideo");

const createProblem = async (req, res) => {
    const {
        title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases,
        startCode, referenceSolution
    } = req.body;

    if (!visibleTestCases || !referenceSolution) {
        return res.status(400).json({ error: "Missing visibleTestCases or referenceSolution" });
    }

    try {
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({ error: `Unsupported language: ${language}` });
            }

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            const batchResult = await submitBatch(submissions);
            const tokens = batchResult.map((r) => r.token);

            const testResults = await submitToken(tokens);

            for (const test of testResults) {
                if (test.status_id !== 3) {
                    return res.status(400).json({
                        error: "Reference solution failed a test case",
                        status: test.status,
                        stderr: test.stderr
                    });
                }
            }
        }

        await Problem.create({
            title, description, difficulty, tags,
            visibleTestCases, hiddenTestCases,
            startCode, referenceSolution,
            problemCreator: req.result._id
        });

        res.status(201).json("Problem saved successfully");

    } catch (err) {
        console.error(err);
        res.status(500).json("Error"+err.message);
    }
};
const updateProblem=async(req,res)=>{
 const {id}=req.params;
  const {
        title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases,
        startCode, referenceSolution
    } = req.body;
 try{
    if(!id){
       return res.status(400).send("Missing Id")
    }
    const DsaProblem=Problem.findById(id);
     if(!DsaProblem){
        return res.status(400).send("Id is not present in server");
     }
  for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({ error: `Unsupported language: ${language}` });
            }

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            const batchResult = await submitBatch(submissions);
            const tokens = batchResult.map((r) => r.token);

            const testResults = await submitToken(tokens);

            for (const test of testResults) {
                if (test.status_id !== 3) {
                    return res.status(400).json({
                        error: "Reference solution failed a test case",
                        status: test.status,
                        stderr: test.stderr
                    });
                }
            }
        }
  const newProblem=  await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true},{new:true});
  res.status(200).send(newProblem);


 }
 catch(err){
   res.status(404).send("Errror"+err.message);
 }
}
const deleteProblem=async(req,res)=>{
const {id}=req.params;
try{
if(!id){
    res.status(400).send("Id is missing")
}
const deletedProblem=await Problem.findByIdAndDelete(id);
if(!deletedProblem){
    res.status(400).send("problem is missing");
}
res.status(200).send("successfully deleted");
}

catch(err){
 res.status(500).send("Error"+err.message);
}
}
const getProblemById=async(req,res)=>{
  const {id}=req.params;
  try{
  if(!id){
    res.status(400).send("Id is missing")
  }
const getProblem=await Problem.findById(id).select(' _id title description  difficulty tags visibleTestCases startCode referenceSolution');




if(!getProblem){
    res.status(400).send("problem is missing");
}


//video ka jo bhi url wagarah le aao

// const videos = await SolutionVideo.find({problemId:id});

// if(videos){
//  getProblem.secureUrl=secureUrl;
//  getProblem.cloudinaryPublicId= cloudinaryPublicId;
//  getProblem.thumbnailUrl=thumbnailUrl;
//  getProblem.duration=duration;
//    return  res.status(200).send(getProblem);
// }
res.status(200).send(getProblem);
}

catch(err){
 res.status(500).send("Error"+err.message);
}
}
const getAllProblem=async(req,res)=>{
try{
const getProblem=await Problem.find({}).select('_id title  difficulty tags');
if(getProblem.length==0){
    res.status(400).send("problem is missing");
}
res.status(200).send(getProblem);
}

catch(err){
 res.status(500).send("Error"+err.message);
}
}
const solvedAllProblembyUser=async(req,res)=>{
  try{
    const userId= req.result._id;
    const user = await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
    });
    res.status(200).send(user);
  }
  catch(err){
    res.status(500).send("server error");
  }
}
const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;  
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });
    if (ans.length == 0)
      return res.send("No submission");  

    res.status(200).send(ans);
  }
  catch (err) {
    res.status(500).send("Internal server error" + err.message);
  }
}
module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};