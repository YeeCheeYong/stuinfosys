const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");
const authController = require("../controllers/authController");

router.post(
  "/",
  authController.protect,
  authController.restrictTo("teacher"),
  gradeController.submitGrade
);
router.patch(
  "/",
  authController.protect,
  authController.restrictTo("teacher"),
  gradeController.updateGrade
);
router.get(
  "/class/:class_id",
  authController.protect,
  //authController.restrictTo("teacher"),
  gradeController.getGradesOfAClass
);

router.get(
  "/student/:username",
  authController.protect,
  authController.restrictTo("admin", "student"),
  gradeController.getGradesOfAStudent
);

module.exports = router;
