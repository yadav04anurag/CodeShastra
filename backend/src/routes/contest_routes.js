const express = require('express');
const contestRouter = express.Router();
const Contest = require('../models/Contest');
const ContestProblem = require('../models/ContestProblem');
const ContestSubmission = require('../models/ContestSubmission');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

// Create a new contest (Admin only)
contestRouter.post('/', adminMiddleware, async (req, res) => {
  try {
    const contest = new Contest(req.body);
    contest.creator = req.result._id;
    await contest.save();
    res.status(201).send(contest);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Get all contests
contestRouter.get('/', userMiddleware, async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate('creator', 'firstName lastName')
      .sort('-startDate');
    res.send(contests);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Get contest by ID
contestRouter.get('/:id', userMiddleware, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('creator', 'firstName lastName')
      .populate('problems');
    
    if (!contest) {
      return res.status(404).send('Contest not found');
    }
    
    res.send(contest);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Register for a contest
contestRouter.post('/register/:id', userMiddleware, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).send('Contest not found');
    }
    
    // Check if user is already registered
    if (contest.participants.includes(req.result._id)) {
      return res.status(400).send('Already registered for this contest');
    }
    
    contest.participants.push(req.result._id);
    await contest.save();
    res.send({ message: 'Successfully registered for the contest' });
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// Add problem to contest (Admin only)
contestRouter.post('/:id/problems', adminMiddleware, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).send('Contest not found');
    }
    
    const problem = new ContestProblem({
      ...req.body,
      contest: contest._id,
      creator: req.result._id
    });
    
    await problem.save();
    contest.problems.push(problem._id);
    await contest.save();
    
    res.status(201).send(problem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Submit solution for a contest problem
// contestRouter.post('/:contestId/submit/run/:problemId', userMiddleware, async (req, res) => {
//   try {
//     const contest = await Contest.findById(req.params.contestId);
//     const problem = await ContestProblem.findById(req.params.problemId);
    
//     if (!contest || !problem) {
//       return res.status(404).send('Contest or problem not found');
//     }
    
//     // Check if contest is ongoing
//     const now = new Date();
//     // if (now < contest.startDate || now > contest.endDate) {
//     //   return res.status(400).send('Contest is not currently active');
//     // }
    
//     // Check if user is registered
//     if (!contest.participants.includes(req.result._id)) {
//       return res.status(403).send('You are not registered for this contest');
//     }
    
//     const submission = new ContestSubmission({
//       ...req.body,
//       contest: contest._id,
//       problem: problem._id,
//       user: req.result._id
//     });

//     await submission.save();
//     //console.log(submission);
    
//     // // Here you would typically run the code against test cases
//     // // For demo, we'll simulate a random result
//     // const statuses = ['accepted', 'wrong answer', 'time limit exceeded', 'runtime error'];
//     // const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
//     // submission.status = randomStatus;
//     // if (randomStatus === 'accepted') {
//     //   submission.executionTime = Math.floor(Math.random() * 1000) + 100; // 100-1100ms
//     // }

//     const runCode =  async (submission)=>{
    
//      // 
     
//        const userId = submission.user;
//        const problemId = submission.problem;

//        let {code,language} = submission;

//      if(!userId||!code||!problemId||!language)
//        return res.status(400).send("Some field missing");

//    //    Fetch the problem from database
//       const problem =  await ContestProblem.findById(problemId);
//    //    testcases(Hidden)
//       if(language==='cpp')
//         language='c++'

//    //    Judge0 code ko submit karna hai

    

//    const languageId = getLanguageById(language);

//    const submissions = problem.sampleTestCases.map((testcase)=>({
//        source_code:code,
//        language_id: languageId,
//        stdin: testcase.input,
//        expected_output: testcase.output
//    }));


//    const submitResult = await submitBatch(submissions);
   
//    const resultToken = submitResult.map((value)=> value.token);

//    const testResult = await submitToken(resultToken);

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = true;
//     let errorMessage = null;

//     for(const test of testResult){
//         if(test.status_id==3){
//            testCasesPassed++;
//            runtime = runtime+parseFloat(test.time)
//            memory = Math.max(memory,test.memory);
//         }else{
//           if(test.status_id==4){
//             status = false
//             errorMessage = test.stderr
//           }
//           else{
//             status = false
//             errorMessage = test.stderr
//           }
//         }
//     }

   
//   runtime=runtime.toFixed(2);
//    res.status(201).json({
//     success:status,
//     testCases: testResult,
//     runtime,
//     memory
//    });
      
   
   
// }
//   runCode(submission);
   
    

//    // res.send(submission);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

contestRouter.post('/:contestId/submit/run/:problemId', userMiddleware, async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const { code, language } = req.body;
    const userId = req.result._id;

    // --- 1. Basic Validation ---
    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required.' });
    }
    
    const contest = await Contest.findById(contestId);
    const problem = await ContestProblem.findById(problemId);

    if (!contest || !problem) {
      return res.status(404).json({ message: 'Contest or problem not found.' });
    }

    // --- 2. Authorization Checks ---
    if (!contest.participants.includes(userId)) {
      return res.status(403).json({ message: 'You are not registered for this contest.' });
    }
    
    //(Optional but recommended) Check if contest is active
    const now = new Date();
    if (now < contest.startDate || now > contest.endDate) {
       return res.status(400).json({ message: 'Contest is not currently active.' });
    }

    // --- 3. Prepare for Code Execution ---
    // Here we use the language value directly from the request. It must be 'cpp', 'java', etc.
    // We need to convert it to the format Judge0 expects ('c++').
    let judgeLanguage = language;
    if (language === 'cpp') {
      judgeLanguage = 'c++';
    }
    const languageId = getLanguageById(judgeLanguage);
    
    if (!languageId) {
        return res.status(400).json({ message: `Language '${language}' is not supported.` });
    }

    const submissions = problem.sampleTestCases.map(testcase => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    if (submissions.length === 0) {
        return res.status(200).json({ message: "No sample test cases to run.", testResults: [] });
    }

    // --- 4. Execute Code and Send Response ---
    const batchResult = await submitBatch(submissions);
    const tokens = batchResult.map(result => result.token);
    const testResults = await submitToken(tokens);

    // No need to save to DB for a 'run' request. Just return the results.
    res.status(200).json({ 
        message: "Code executed against sample test cases.",
        results: testResults 
    });

  } catch (error) {
    console.error('Error during code run:', error);
    res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
  }
});

// contestRouter.post('/:contestId/submit/submit_final/:problemId', userMiddleware, async (req, res) => {
//   try {
//     const contest = await Contest.findById(req.params.contestId);
//     const problem = await ContestProblem.findById(req.params.problemId);
    
//     if (!contest || !problem) {
//       return res.status(404).send('Contest or problem not found');
//     }
    
//     // Check if contest is ongoing
//     const now = new Date();
//     // if (now < contest.startDate || now > contest.endDate) {
//     //   return res.status(400).send('Contest is not currently active');
//     // }
    
//     // Check if user is registered
//     if (!contest.participants.includes(req.result._id)) {
//       return res.status(403).send('You are not registered for this contest');
//     }
    
//     const submission = new ContestSubmission({
//       ...req.body,
//       contest: contest._id,
//       problem: problem._id,
//       user: req.result._id
//     });

//     await submission.save();
//     //console.log(submission);
    
//     // // Here you would typically run the code against test cases
//     // // For demo, we'll simulate a random result
//     // const statuses = ['accepted', 'wrong answer', 'time limit exceeded', 'runtime error'];
//     // const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
//     // submission.status = randomStatus;
//     // if (randomStatus === 'accepted') {
//     //   submission.executionTime = Math.floor(Math.random() * 1000) + 100; // 100-1100ms
//     // }

//   const submitCode = async (submission)=>{
   
//     // 
    
      
//        const userId = submission.user;
//        const problemId = submission.problem;

//        let {code,language} = submission;

//       if(!userId||!code||!problemId||!language)
//         return res.status(400).send("Some field missing");
      

//       //    Fetch the problem from database
//       const problem =  await ContestProblem.findById(problemId);
//    //    testcases(Hidden)
//       if(language==='cpp')
//         language='c++'
      
      
    
//     //   Kya apne submission store kar du pehle....
//     const submittedResult = await ContestSubmission.create({
//           userId,
//           problemId,
//           code,
//           language,
//           status:'pending',
//           testCasesTotal:problem.testCases.length
//      })

//     //    Judge0 code ko submit karna hai
    
//     const languageId = getLanguageById(language);
   
//     const submissions = problem.testCases.map((testcase)=>({
//         source_code:code,
//         language_id: languageId,
//         stdin: testcase.input,
//         expected_output: testcase.output
//     }));

    
//     const submitResult = await submitBatch(submissions);
    
//     const resultToken = submitResult.map((value)=> value.token);

//     const testResult = await submitToken(resultToken);
    

//     // submittedResult ko update karo
//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = 'accepted';
//     let errorMessage = null;


//     for(const test of testResult){
//         if(test.status_id==3){
//            testCasesPassed++;
//            runtime = runtime+parseFloat(test.time)
//            memory = Math.max(memory,test.memory);
//         }else{
//           if(test.status_id==4){
//             status = 'error'
//             errorMessage = test.stderr
//           }
//           else{
//             status = 'wrong'
//             errorMessage = test.stderr
//           }
//         }
//     }


//     // Store the result in Database in Submission
//     submittedResult.status   = status;
//     submittedResult.testCasesPassed = testCasesPassed;
//     submittedResult.errorMessage = errorMessage;
//     submittedResult.executionTime = runtime;
//     submittedResult.memory = memory;

//     await submittedResult.save();
    
//     // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
//     // req.result == user Information

    
    
//     const accepted = (status == 'accepted')
//     res.status(201).json({
//       accepted,
//       totalTestCases: submittedResult.testCasesTotal,
//       passedTestCases: testCasesPassed,
//       runtime,
//       memory
//     });
       
   
// }
// submitCode(submission);
//    // res.send(submission);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });



// Get contest leaderboard

contestRouter.post('/:contestId/submit/submit_final/:problemId', userMiddleware, async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const { code, language } = req.body;
    const userId = req.result._id;

    // --- 1. Basic Validation ---
    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required.' });
    }

    const contest = await Contest.findById(contestId);
    const problem = await ContestProblem.findById(problemId);

    if (!contest || !problem) {
      return res.status(404).json({ message: 'Contest or problem not found.' });
    }

    // --- 2. Authorization Checks ---
    if (!contest.participants.includes(userId)) {
      return res.status(403).json({ message: 'You are not registered for this contest.' });
    }
    
    const now = new Date();
    if (now < contest.startDate || now > contest.endDate) {
       return res.status(400).json({ message: 'Contest is not currently active.' });
    }

    // --- 3. Create Initial Submission in DB (Status: "pending") ---
    // Here we use the 'language' value ('cpp') which is valid for our schema.
    const submission = await ContestSubmission.create({
      user: userId,
      problem: problemId,
      contest: contestId,
      code: code,
      language: language, // Using the valid enum 'cpp'
      status: 'pending'
    });

    // --- 4. Prepare and Execute Code against HIDDEN Test Cases ---
    let judgeLanguage = language;
    if (language === 'cpp') {
      judgeLanguage = 'c++';
    }
    const languageId = getLanguageById(judgeLanguage);
    
    const submissions = problem.testCases.map(testcase => ({ // Using hidden 'testCases'
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));
    
    if (submissions.length === 0) {
        // If there are no hidden test cases, mark as accepted.
        submission.status = 'accepted';
        await submission.save();
        return res.status(200).json({ message: "Submission accepted (no hidden test cases).", submissionId: submission._id });
    }

    const batchResult = await submitBatch(submissions);
    const tokens = batchResult.map(result => result.token);
    const testResults = await submitToken(tokens);

    // --- 5. Process Results and Update the Submission in DB ---
    let passedCount = 0;
    let totalTime = 0;
    let maxMemory = 0;
    let finalStatus = 'accepted';
    let finalErrorMessage = null;

    for (const result of testResults) {
      if (result.status_id === 3) { // 3: Accepted
        passedCount++;
        totalTime += parseFloat(result.time || 0);
        maxMemory = Math.max(maxMemory, result.memory || 0);
      } else {
        // If any test case fails, the entire submission is not 'accepted'.
        // We record the status of the first failed test case.
        if (finalStatus === 'accepted') {
            switch (result.status_id) {
                case 4: finalStatus = 'wrong answer'; break;
                case 5: finalStatus = 'time limit exceeded'; break;
                default: finalStatus = 'runtime error'; break;
            }
            finalErrorMessage = result.stderr || result.compile_output || 'Execution failed.';
        }
      }
    }

    // --- 6. Save the final results to the submission document ---
    submission.status = finalStatus;
    submission.testCasesPassed = passedCount;
    submission.errorMessage = finalErrorMessage;
    submission.executionTime = totalTime.toFixed(3);
    submission.memory = maxMemory;
    
    await submission.save();

    // --- 7. Send Final Response to Client ---
    res.status(201).json({
      message: "Submission processed.",
      submissionId: submission._id,
      status: submission.status,
      testCasesTotal: problem.testCases.length,
      testCasesPassed: submission.testCasesPassed,
      executionTime: submission.executionTime,
      memory: submission.memory
    });

  } catch (error) {
    console.error('Error during final submission:', error);
    // This will catch both server errors and Mongoose ValidationErrors
    res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
  }
});


contestRouter.get('/:id/leaderboard', userMiddleware, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).send('Contest not found');
    }
    
    const submissions = await ContestSubmission.find({ contest: contest._id })
      .populate('user', 'firstName lastName')
      .populate('problem', 'title');
    
    // Calculate leaderboard
    const leaderboard = {};
    
    submissions.forEach(sub => {
      if (!leaderboard[sub.user._id]) {
        leaderboard[sub.user._id] = {
          user: sub.user,
          solved: 0,
          totalTime: 0,
          attempts: {},
          problems: {}
        };
      }
      
      const userEntry = leaderboard[sub.user._id];
      
      if (!userEntry.attempts[sub.problem._id]) {
        userEntry.attempts[sub.problem._id] = 0;
      }
      
      userEntry.attempts[sub.problem._id]++;
      
      if (sub.status === 'accepted' && !userEntry.problems[sub.problem._id]) {
        userEntry.solved++;
        // Penalty for wrong attempts before correct solution
        const penalty = (userEntry.attempts[sub.problem._id] - 1) * 20; 
        const solveTime = Math.floor((sub.submittedAt - contest.startDate) / 60000); // in minutes
        userEntry.totalTime += solveTime + penalty;
        userEntry.problems[sub.problem._id] = {
          time: solveTime,
          attempts: userEntry.attempts[sub.problem._id]
        };
      }
    });
    
    // Convert to array and sort
    const leaderboardArray = Object.values(leaderboard).sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved;
      return a.totalTime - b.totalTime;
    });
    
    res.send(leaderboardArray);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = contestRouter;





