const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    marks: {
      type: [marksSchema],
      default: [],
    },
  },
  { versionKey: false }
);
module.exports = mongoose.model("studentTable", studentSchema);
