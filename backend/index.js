const express = require("express");
require("dotenv").config();
const { generateFile } = require("./generateFile");

const { DBConnection } = require("./database/db");
const cors = require("cors");

const { authRoutes } = require("./routes/auth");
const { default: mongoose } = require("mongoose");
const { executeCpp } = require("./executeCpp");

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
  // console.log(req.body);
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body" });
  }
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    // console.log(filepath);

    //we need to run the file and send the respose
    const output = await executeCpp(filepath);
    return res.status(400).json({ output });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

app.listen(8000, () => {
  console.log("server listen in 8080");
});
