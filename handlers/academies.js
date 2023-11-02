const Academy = require("../pkg/academies");

const create = async (req, res) => {
  try {
    const academy = await Academy.create(req.body);
    return res.status(201).send(academy);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAll = async (req, res) => {
  try {
    const academies = await Academy.find().select("-courses");
    return res.status(200).send(academies);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  create,
  getAll
};