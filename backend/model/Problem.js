const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  problemNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  statement: {
    type: String,
    required: true,
  },
  examples: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: String,
    },
  ],

  constraints: {
    type: String,
    required: true,
  },
  testCases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestCase",
    },
  ],
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
