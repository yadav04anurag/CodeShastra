const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");

const getstats= async (req,res)=>{
    try {
        const userId = req.result._id;

        // Count solved problems (unique problems with at least one accepted submission)
        const solvedProblems = await Submission.distinct('problemId',{ userId: userId, status: "accepted" });
        const solvedCount = solvedProblems.length;

        // Total submissions by user
        const totalSubmissions = await Submission.countDocuments({ userId: userId });

        // Accuracy calculation
        const accuracy = totalSubmissions === 0 ? "0.00" : ((solvedCount / totalSubmissions) * 100).toFixed(2);

        // Get all problems solved by user with their difficulty
        const problems = await Problem.find({ _id: { $in: solvedProblems } }, "difficulty");

        let easySolved = 0, mediumSolved = 0, hardSolved = 0;
        problems.forEach(p => {
            if (p.difficulty === "easy") easySolved++;
            else if (p.difficulty === "medium") mediumSolved++;
            else if (p.difficulty === "hard") hardSolved++;
        });

        res.json({
            solvedCount,
            totalSubmissions,
            accuracy,
            easySolved,
            mediumSolved,
            hardSolved
        });
    } catch (err) {
        res.status(500).json({ error: "Server error "+err.message });
    }
}


const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.result._id;

        // Aggregate submissions with problem title, sorted by submittedAt descending
        const submissions = await Submission.aggregate([
            { 
            $match: { 
                userId: userId, 
            } 
            },
            { $sort: { createdAt: -1 } },
            {
            $lookup: {
                from: "problems",
                localField: "problemId",
                foreignField: "_id",
                as: "problem"
            }
            },
            { $unwind: "$problem" },
            {
            $project: {
                _id: 1,
                problemId: 1,
                problemTitle: "$problem.title",
                status: 1,
                language: 1,
                createdAt: 1
            }
            }
        ]);

        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: "Server error " + err.message });
    }
};

module.exports={getstats,getUserSubmissions};