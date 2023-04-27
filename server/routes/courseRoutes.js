const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");

router.get("/:course_id/class", classController.getClassesOfACourse);
router.get("/:course_id", courseController.getSingleCourse);
router.get("/", courseController.getCourses);
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  courseController.validatePrerequisites,
  courseController.createCourse
);
router.patch(
  "/:course_id",
  authController.protect,
  authController.restrictTo("admin"),
  courseController.validatePrerequisites,
  courseController.updateCourse
);

module.exports = router;
