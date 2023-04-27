"use strict";
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Class = require("../models/classModel");

exports.validatePrerequisites = catchAsync(async (req, res, next) => {
  const prerequisites = req.body.prerequisites;
  if (prerequisites && !Array.isArray(prerequisites)) {
    return next(
      new AppError("Prerequisites must be an array of course IDs", 405)
    );
  }

  if (prerequisites && prerequisites.length > 0) {
    const existingCourses = await Course.findAll({
      attributes: ["course_id"],
    });
    const existingCourseIds = existingCourses.map((course) => course.course_id);
    const missingCourseIds = [];
    for (const courseId of prerequisites) {
      if (!existingCourseIds.includes(courseId)) {
        missingCourseIds.push(courseId);
      }
    }
    if (missingCourseIds.length > 0) {
      return next(
        new AppError(
          `Invalid prerequisite course IDs provided: ${missingCourseIds.join(
            ", "
          )}`,
          405
        )
      );
    }
  }
  next();
});

exports.getCourses = catchAsync(async (req, res, next) => {
  const result = await Course.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json({
    status: "success",
    result,
  });
});
exports.getSingleCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    where: { course_id: req.params.course_id },
    inclue: [Class],
  });
  if (course == null) return next(new AppError(`Course Does Not found`, 404));
  res.status(200).json(course);
});

exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(200).json(course);
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  let course = await Course.findOne({
    where: { course_id: req.params.course_id },
  });
  if (course == null) return next(new AppError(`Course Does Not found`, 404));
  course = await Course.update(req.body, {
    returning: true,
    where: { course_id: req.params.course_id },
  });
  const data = course[1];
  res.status(200).json({ message: "Successfully updated", data });
});
