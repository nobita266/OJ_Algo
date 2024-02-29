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
  const { language, code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body" });
  }
  console.log(language, code);
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    console.log(language);

    //we need to run the file and send the respose
    if (language === "cpp") {
      const output = await executeCpp(filepath);
      return res.status(200).json({ filepath, output });
    } else {
      const output = await executePy(filepath);
      return res.status(200).json({ filepath, output });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
});
//get all problems
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
app.get("/problems/:problemNumber", async (req, res) => {
  const { problemNumber } = req.params;
  try {
    const problem = await Problem.findOne({ problemNumber });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(8000, () => {
  console.log("server listen in 8080");
});
