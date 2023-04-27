const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Grade = require("../models/gradeModel");
const Class = require("../models/classModel");
const { Op } = require("sequelize");

exports.submitGrade = catchAsync(async (req, res, next) => {
  // class id, username, grade, credit
  // initially while enrolling in class
  const result = await Grade.create(req.body);
  res.status(200).json(result);
});

exports.getGradesOfAClass = catchAsync(async (req, res, next) => {
  const result = await Grade.findAll({
    where: { class_id: req.params.class_id },
  });

  res.status(200).json(result);
});

exports.getGradesOfAStudent = catchAsync(async (req, res, next) => {
  data = await Grade.findAll({
    where: { username: req.params.username },
    include: {
      model: Class,
      attributes: ["class_id", "course_id", "teacher"],
      include: {
        model: Course,
        attributes: ["credit"],
      },
    },
  });
  if (data.length > 0) {
    const extractedData = data.map(
      ({
        class_id,
        class: {
          course_id,
          course: { credit },
        },
        grade,
      }) => ({
        class_id,
        course_id,
        credit,
        grade,
      })
    );
    data = extractedData;
  }
  res.status(200).json(data);
});

exports.updateGrade = catchAsync(async (req, res, next) => {
  const gradings = req.body;

  const promises = gradings.map((temp) => {
    return Grade.update(
      { grade: temp.grade, credit: temp.credit },
      { where: { class_id: temp.class_id, username: temp.username } }
    );
  });

  const result = await Promise.all(promises);
  res.status(200).json();
});
