const Course = require("../pkg/courses");

const create = async (req, res) => {
  try {
    if (!req.auth.id) {
      return res.status(400).send("Unauthorized action!");
    }
    const data = {
      ...req.body,
      author: req.auth.id
    };
    const course = await Course.create(data);
    return res.status(201).send(course);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAll = async (req, res) => {
  try {
    const courses = await Course.find();
    const totalCourses = courses.length;
    return res.status(200).send({
      message: `${totalCourses} courses found successfully`,
      data: courses
    })
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getOne = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    return res.status(200).send(course);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const update = async (req, res) => {
  try {
    if (!req.auth.id) {
      return res.status(400).send("Unauthorized action!");
    }
    const data = {
      ...req.body,
      author: req.auth.id
    }
    await Course.findByIdAndUpdate(req.params.id, data);
    return res.status(204).send("Course updated successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const remove = async (req, res) => {
  try {
    if (!req.auth.id) {
      return res.status(400).send("Unauthorized action!");
    }
    await Course.findByIdAndDelete(req.params.id);
    return res.status(204).send("Course removed successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};