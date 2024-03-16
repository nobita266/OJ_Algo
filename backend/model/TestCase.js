const mongoose = require("mongoose");
const TestCaseSchema = new mongoose.Schema({
  testcaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  testInput: {
    type: String,
  },
  expectedOutput: {
    type: String,
  },
});
module.exports = mongoose.model("TestCase", TestCaseSchema);
