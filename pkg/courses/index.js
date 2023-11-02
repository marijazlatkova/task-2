const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  academy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "academy"
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "account"
  }
});

module.exports = mongoose.model("course", courseSchema, "courses");