const Studentttt = require("../models/StudentModel");
const JWT = require("jsonwebtoken");
const createStudent = async (req, res) => {
  try {
    const { name, email, mobile, city, section, marks } = req.body;
    const student = new Studentttt({
      name,
      email,
      mobile,
      city,
      section,
      marks,
    });
    await student.save();
    res.status(201).json({
      statuscode: "200",
      message: "data posted successfully",
      student,
    });
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};
const jwtMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(400).json({ message: "token not found" });
  }
  const Token = authorization?.split?.(" ")[1];
  if (!Token) {
    res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const decode = JWT.verify(Token, process.env.secretKey);
    console.log("decdoeeeeee", decode);
    const { admin, email } = decode;
    req.userdetails = { admin, email };
    next();
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};
const getStudent = async (req, res) => {
  try {
    const { admin, email } = req.userdetails;
    let student;
    console.log("studentttttttt", student);

    if (admin) {
      student = await Studentttt.find();
    } else {
      singleStudent = await Studentttt.findOne({ email });
      student = singleStudent ? [singleStudent] : [];
    }

    const totalcount = student ? student.length : 0;
    if (student) {
      res.status(200).json({ student, totalcount, statuscode: "200" });
    } else {
      res.status(200).json({ statuscode: "400", message: "No records found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      statuscode: "500",
      message: "Internal server error",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { name, email, mobile, city, section, marks } = req.body;

    const student = await Studentttt.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, city, section, marks },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ statuscode: "404", message: "Student not found" });
    }

    res.status(200).json({
      statuscode: "200",
      message: "Updated successfully",
      student,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      statuscode: "500",
      message: "Internal server error",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deletestu = await Studentttt.findByIdAndDelete(req.params.id);
    if (!deletestu) {
      res
        .status(200)
        .json({ statuscode: "400", message: "something went wrong" });
    }
    res
      .status(200)
      .json({ statuscode: "200", message: "deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ statuscode: "500", message: "Internal server error" });
    console.log("errror", error);
  }
};
module.exports = {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  jwtMiddleware,
};
