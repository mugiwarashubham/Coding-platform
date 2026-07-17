const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemutility");

const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !code || !problemId || !language)
            return res.status(400).send("some field missing");

        const problem = await Problem.findById(problemId);
        if (!problem)
            return res.status(404).send("Problem not found");

        const submitResult = await Submission.create({
            userId,        // ✅ same naam
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: "pending",
            testCasesTotal: problem.hiddenTestCases.length
        });

        const languageId = getLanguageById(language);
        if (!languageId)
            return res.status(400).send("Unsupported language");

        const submissions = problem.hiddenTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        }));

        const batchResult = await submitBatch(submissions);
        const tokens = batchResult.map((r) => r.token);
        const testResults = await submitToken(tokens);

        let testCasesPassed = 0;
        let status = "accepted";   
        let runtime = 0;
       let memory = 0;
        let errorMessage = null;

        for (const test of testResults) {
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time ?? "0") || 0;
               memory = Math.max(memory, parseInt(test.memory ?? "0") || 0);
            } else {
                status = test.status_id === 4 ? "wrong" : "error";
                errorMessage = test.stderr || test.compile_output;
            }
        }

        submitResult.status = status;
        submitResult.testCasesPassed = testCasesPassed;
        submitResult.errorMessage = errorMessage;
        submitResult.runtime = runtime;
        submitResult.memory = memory;
        await submitResult.save();

        //problemid ko insert karenge userSchema mein if it is not present their 
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        res.status(201).json(submitResult);

    } catch (err) {
     console.error(err);
     res.status(500).send("Internal server error: " + err.message);
    }
};
const runCode=async(req,res)=>{

     try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !code || !problemId || !language)
            return res.status(400).send("some field missing");

        const problem = await Problem.findById(problemId);
        if (!problem)
            return res.status(404).send("Problem not found");

       

        const languageId = getLanguageById(language);
        if (!languageId)
            return res.status(400).send("Unsupported language");

        const submissions = problem.visibleTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        }));

        const batchResult = await submitBatch(submissions);
        const tokens = batchResult.map((r) => r.token);
        const testResults = await submitToken(tokens);


        res.status(201).send(testResults);

    } catch (err) {
     console.error(err);
     res.status(500).send("Internal server error: " + err.message);
    }
}

module.exports = {submitCode,runCode};