const express = require("express");
const router = express.Router();
const studentController = require("../controllers/StudentController");

router.post("/createstudent", studentController.createStudent);
router.get(
  "/getstudent",
  studentController.jwtMiddleware,
  studentController.getStudent
);
router.put("/update/:id", studentController.updateStudent);
router.delete("/delete/:id", studentController.deleteStudent);

module.exports = router;
