const mongoose = require("mongoose");

const academySchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  contactInfo: {
    email: String,
    phone: Number,
    website: String
  },
  courses: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "course"
    }
  ]
});

module.exports = mongoose.model("academy", academySchema, "academies");