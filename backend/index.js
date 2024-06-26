const express = require("express");
require("dotenv").config();
const { generateFile } = require("./generateFile");
const { Travel } = require("./model/User");
const { DBConnection } = require("./database/db");
const cors = require("cors");

const { authRoutes } = require("./routes/auth");
const { default: mongoose } = require("mongoose");
const { executeCpp } = require("./executeCpp");
const Problem = require("./model/Problem");
const { executePy } = require("./executePy");
const { generateInputFile } = require("./generateInputFile");
const User = require("./model/User");
const SolvedProblem = require("./model/solvedProblem");
const { verifyToken } = require("./middleware/verifyToken");
const TestCase = require("./model/TestCase");
const axios = require("axios");

//middlewares

const app = express();

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = express.Router();
app.use(routes);
DBConnection();
app.use("/api/auth", authRoutes);

app.post("/run", async (req, res) => {
  console.log("i m in run api");
  const { language, code, input } = req.body;

  console.log(req.body);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body" });
  }

  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    //generate input text file
    const inputPath = await generateInputFile(input);
    console.log("inputPath", inputPath);

    //we need to run the file and send the respose
    if (language === "cpp") {
      const output = await executeCpp(filepath, inputPath);
      return res.status(200).json({ filepath, output });
    } else {
      const output = await executePy(filepath, inputPath);
      return res.status(200).json(output);
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
});
//create problem
app.post("/problems", async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    return res.status(200).json({ msg: "successfully added problem" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});
// Get all problems
app.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a single problem by problemNumber
app.get("/problems/:problemId", async (req, res) => {
  const { problemId } = req.params;
  const _id = problemId;
  try {
    const problem = await Problem.findById({ _id });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete problem from the database
app.delete("/problems/:_id", async (req, res) => {
  // console.log(req.params);
  const { _id } = req.params;
  try {
    const deletedProblem = await Problem.findByIdAndDelete(_id);
    if (!deletedProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res
      .status(200)
      .json({ message: "Problem deleted successfully", deletedProblem });
  } catch (err) {
    console.error("Error deleting problem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/codeSubmit", verifyToken, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    // Get user ID from verified token
    const userId = req.userId;

    // Get problem details including test cases from problemId
    const problem = await Problem.findById(problemId);

    let testResults = [];
    for (const testCaseId of problem.testCases) {
      const testCase = await TestCase.findById(testCaseId);
      console.log(testCase);
      const { data } = await axios.post("http://localhost:8000/run", {
        language,
        code,
        input: testCase.testInput,
      });
      console.log(data);

      // Compare output with expected output
      const passed = data.output === testCase.expectedOutput;
      const result = {
        input: testCase.testInput,
        expectedOutput: testCase.expectedOutput,
        actualOutput: data.output,
        passed: passed,
      };

      testResults.push(result);

      // If test case failed, stop further execution
      if (!passed) break;
    }

    if (testResults[testResults.length - 1].passed) {
      const userDetails = await User.findById(userId);

      const solvedProblem = userDetails.solvedProblem;
      console.log(solvedProblem);
      if (solvedProblem.indexOf(problemId) < 0) {
        solvedProblem.push(problemId);
      }

      await userDetails.save();
      let solvedCode = await SolvedProblem.findOne({ userId, problemId });
      if (solvedCode) {
        solvedCode.code = code;
        solvedCode.language = language;
      } else {
        solvedCode = new SolvedProblem({
          userId,
          problemId,
          code,
          language,
        });
      }
      await solvedCode.save();
      res
        .status(200)
        .json({ msg: "successfully passed all problems", testResults });
    } else {
      // If test case failed, send failure response
      res.status(400).json({
        msg: "failed at this testcase",
        yourOutput: testResults[testResults.length - 1],
      });
    }
  } catch (error) {
    // Send error response
    return res.status(500).json({ error: error.message });
  }
});
//adding testcases
app.post("/addTestcases", async (req, res) => {
  const { problemId, testInput, expectedOutput } = req.body;
  try {
    const testCase = new TestCase({
      problemId,
      testInput,
      expectedOutput,
    });
    await testCase.save();
    const problem = await Problem.findById(problemId);
    console.log(problem);
    if (!problem) {
      res.status(400).json({ msg: "problemId not found or problem not exist" });
    }
    problem.testCases.push(testCase);
    await problem.save();

    return res.status(200).json({ msg: "testcase successfully added" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
//fetch all user to show on the profile page
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: "error in fetching details" });
  }
});
app.listen(8000, () => {
  console.log("server listen in 8080");
});
