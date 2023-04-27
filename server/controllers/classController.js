"use strict";
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Class = require("../models/classModel");
const Grade = require("../models/gradeModel");
const Course = require("../models/courseModel");
const { Op } = require("sequelize");
const sequelize = require("../db");

exports.getClasses = catchAsync(async (req, res, next) => {
  const result = await Class.findAll({ include: [Course] });
  res.status(200).json({
    status: "success",
    result,
  });
});

exports.getClassesOfACourse = catchAsync(async (req, res, next) => {
  const result = await Class.findAll({
    where: { course_id: req.params.course_id },
    order: [["createdAt", "DESC"]],
  });
  const courseTitle = await Course.findOne({
    where: { course_id: req.params.course_id },
    attributes: ["title"],
  });
  // console.log(result)
  res.status(200).json({
    status: "success",
    courseTitle,
    result,
  });
});

exports.getMyClasses = catchAsync(async (req, res, next) => {
  const username = req.user.username;
  const role = req.user.role;
  let data;
  if (role == "teacher") {
    data = await Class.findAll({
      where: { teacher: username },
      include: [
        {
          model: Course,
          attributes: ["course_id"],
        },
      ],
    });
  } else {
    data = await Grade.findAll({
      where: { username },
      attributes: [],
      include: [
        {
          model: Class,
          include: [{ model: Course, attributes: ["course_id"] }],
        },
      ],
    });
    let temp = data;
    data = [];
    temp.forEach((element) => {
      data.push(element.class);
    });
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getSingleClass = catchAsync(async (req, res, next) => {
  const result = await Class.findOne({
    where: { class_id: req.params.class_id },
    include: [
      { model: Course },
      { model: User, attributes: ["first_name", "last_name"] },
    ],
  });
  if (result == null) return next(new AppError(`Class Does Not found`, 404));
  res.status(200).json({
    status: "success",
    result,
  });
});

exports.verifyClassEnrolment = catchAsync(async (req, res, next) => {
  const student = req.user.username;
  const result1 = await Grade.findAll({
    where: { username: student, grade: { [Op.not]: null } },
    include: {
      model: Class,
      attributes: ["course_id"],
    },
    attributes: [],
  });
  const completed_courses = [
    ...new Set(result1.map((temp) => temp.class.course_id)),
  ];
  //console.log("done", completed_courses);
  const result2 = await Class.findOne({
    where: { class_id: req.params.class_id },
    include: {
      model: Course,
      attributes: ["prerequisites", "credit"],
    },
    attributes: ["course_id", "pending_students", "approved_students"],
  });

  if (result2.pending_students.includes(student)) {
    return next(new AppError("You have already applied for enrolment", 405));
  }
  if (result2.approved_students.includes(student)) {
    return next(new AppError("You are already enrolled in the class", 405));
  }
  const prerequisites = result2.course.prerequisites;
  //console.log("need", prerequisites);

  if (completed_courses.includes(result2.course_id)) {
    return next(new AppError("You have already completed this course", 405));
  }
  const incomplete_prerequisites = prerequisites.filter(
    (prereq) => !completed_courses.includes(prereq)
  );

  if (incomplete_prerequisites.length > 0)
    return next(
      new AppError(
        `You need to complete the following prerequisites: ${incomplete_prerequisites.join(
          ", "
        )}`,
        405
      )
    );

  res.status(200).json();
});

exports.requestClassEnrolment = catchAsync(async (req, res, next) => {
  const student = req.user.username;
  const result1 = await Grade.findAll({
    where: { username: student, grade: { [Op.not]: null } },
    include: {
      model: Class,
      attributes: ["course_id"],
    },
    attributes: [],
  });
  const completed_courses = [
    ...new Set(result1.map((temp) => temp.class.course_id)),
  ];
  //console.log("done", completed_courses);
  const result2 = await Class.findOne({
    where: { class_id: req.params.class_id },
    include: {
      model: Course,
      attributes: ["prerequisites", "credit"],
    },
    attributes: ["course_id", "pending_students", "approved_students"],
  });

  if (result2.pending_students.includes(student)) {
    return next(new AppError("You have already applied for enrolment", 405));
  }
  if (result2.approved_students.includes(student)) {
    return next(new AppError("You are already enrolled in the class", 405));
  }
  const prerequisites = result2.course.prerequisites;
  //console.log("need", prerequisites);

  if (completed_courses.includes(result2.course_id)) {
    return next(new AppError("You have already completed this course", 405));
  }
  // // add to pending array

  const incomplete_prerequisites = prerequisites.filter(
    (prereq) => !completed_courses.includes(prereq)
  );

  if (incomplete_prerequisites.length > 0)
    return next(
      new AppError(
        `You need to complete the following prerequisites: ${incomplete_prerequisites.join(
          ", "
        )}`,
        405
      )
    );
  await Class.update(
    {
      pending_students: sequelize.fn(
        "array_append",
        sequelize.col("pending_students"),
        student
      ),
    },
    { where: { class_id: req.params.class_id } }
  );
  res.status(200).json();
});

exports.createClass = catchAsync(async (req, res, next) => {
  const teacher = await User.findOne({
    where: { role: "teacher", username: req.body.teacher },
  });
  if (!teacher)
    return next(new AppError(`teacher ${req.body.teacher} doesn't exist`, 405));

  const course = await Class.create(req.body);
  res.status(200).json(course);
});

exports.updateClass = catchAsync(async (req, res, next) => {
  let _class = await Class.findOne({
    where: { class_id: req.params.class_id },
  });
  if (_class == null) return next(new AppError(`Class Does Not found`, 404));
  const teacher = await User.findOne({
    where: { role: "teacher", username: req.body.teacher },
  });
  if (!teacher)
    return next(new AppError(`teacher ${req.body.teacher} doesn't exist`, 405));
  _class = await Class.update(req.body, {
    returning: true,
    where: { class_id: req.params.class_id },
  });
  res.status(200).json({
    message: "Successfully updated",
    class: _class[1][0],
  });
});

exports.approveOrDeclineClassEnrolment = catchAsync(async (req, res, next) => {
  const _class = await Class.findOne({
    where: { class_id: req.params.class_id },
    include: {
      model: Course,
    },
  });
  if (_class) {
    let pending_students = _class.pending_students;
    let approved_students = _class.approved_students;
    pending_students = pending_students.filter(function (std) {
      return std !== req.params.username;
    });

    if (req.params.action == "approve") {
      approved_students.push(req.params.username);
      await Grade.create({
        username: req.params.username,
        class_id: req.params.class_id,
      });
    }
    await Class.update(
      { approved_students, pending_students },
      { where: { class_id: req.params.class_id } }
    );
    res.status(200).json({
      message: "Successfully updated",
    });
  } else {
    return next(new AppError("Invalid Class Id", 405));
  }
});
