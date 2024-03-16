const mongoose = require("mongoose");

const solvedProblemSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  code: {
    type: String,
    required: true,
  },

  language: {
    type: String,
    required: true,
  },
});

const Problem = mongoose.model("SolvedProblem", solvedProblemSchema);

module.exports = Problem;
