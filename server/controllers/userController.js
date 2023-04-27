"use strict";
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Class = require("../models/classModel");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const jwtGenerator = require("../utils/jwtGenerator");
const Course = require("../models/courseModel");
const Grade = require("../models/gradeModel");
const { Op } = require("sequelize");

const createSendToken = (req, res, user, message) => {
  const jwtToken = jwtGenerator(
    { username: user.username },
    process.env.jwtSessionTokenExpire
  );

  res.cookie("jwt", jwtToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    //secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  if (process.env.NODE_ENV === "prooooductin") cookieOptions.secure = true;
  user.password = undefined;
  //console.log(user);
  user = user.dataValues;
  res.status(200).json({
    status: "success",
    message,
    user,
  });
};

exports.signIn = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username,
    },
  });
  //console.log(user.user.dataValues);
  if (user == null) return next(new AppError("Invalid Credential", 404));
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return next(new AppError("Invalid Credential", 404));
  createSendToken(req, res, user, "Successfully Logged In!");
});

exports.logOut = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const Op = Sequelize.Op;
  const { email, username, first_name, last_name, password } = req.body;

  let user = await User.findOne({
    where: { email },
  });
  if (user) return next(new AppError("Email is already used!", 405));
  user = await User.findOne({
    where: { username },
  });
  if (user) return next(new AppError("Username Already Exist!", 405));

  const salt = await bcrypt.genSalt(10);
  const encrypted_password = await bcrypt.hash(password, salt);
  user = await User.create({
    username,
    first_name,
    last_name,
    email,
    password: encrypted_password,
  });
  user.password = undefined;

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const username = req.params.username || req.user.username;
  const user = await User.findOne({
    where: {
      username,
    },
    include: [Class],
  });
  if (user == null)
    return next(
      new AppError(`User with Username : ${username} not found!`, 404)
    );
  user.password = undefined;
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ["username", "first_name", "last_name", "role"],
  });
  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const username = req.user.username;
  const allowedFields = ["first_name", "last_name", "description"];
  const user = await User.update(req.body, {
    where: { username },
    fields: allowedFields,
    returning: true,
  });
  res.status(200).json({
    status: "success",
    user: user[1][0],
  });
});

exports.setRole = catchAsync(async (req, res, next) => {
  const { role, username } = req.body;
  let user = await User.findOne({
    where: {
      username,
    },
  });
  if (user == null) return next(new AppError(`User does not exist`, 404));
  user = await User.update(
    { role },
    {
      where: { username },
      returning: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: `User has been made ${role}`,
  });
});

exports.requestTranscript = catchAsync(async (req, res, next) => {
  const username = req.user.username;
  const user = await User.update(
    { isTranscriptPending: true },
    {
      where: { username },
      returning: true,
    }
  );
  res.status(200).json({
    status: "success",
  });
});

exports.approveOrDeclineTranscript = catchAsync(async (req, res, next) => {
  const username = req.params.username;
  const action = req.params.approval;
  let data;
  if (action === "approve") {
    // generate transcript-----
    data = await Grade.findAll({
      where: { username, grade: { [Op.not]: null } },
      include: {
        model: Class,
        attributes: ["class_id"],
        include: {
          model: Course,
          attributes: ["course_id", "title", "credit"],
        },
      },
      attributes: ["grade"],
    });
    let result = [];
    let completed_credit = 0;
    let total_credit = 0;
    let total_grade = 0;
    let gpa = 0;

    if (data.length > 0) {
      result = data.map((item) => {
        const course = item.class.course;
        const grade = item.grade !== null ? item.grade : ""; // If grade is null, use empty string
        if (grade >= 2) {
          completed_credit += course.credit;
          total_grade += course.credit * grade;
          return `${course.course_id}:${course.title}:${course.credit}:${grade}`;
        }
        total_credit += course.credit;
      });
    }
    if (completed_credit > 0) gpa = total_grade / completed_credit;
    const summary =
      String(total_credit) +
      ":" +
      String(completed_credit) +
      ":" +
      String(gpa) +
      ":" +
      Date.now();
    result.unshift(summary);

    data = await User.update(
      { isTranscriptPending: false, transcript_grades: result, gpa },
      {
        where: { username },
        returning: true,
      }
    );
    data = data[1][0];
  } else {
    data = await User.update(
      { isTranscriptPending: false },
      {
        where: { username },
        returning: true,
      }
    );
  }
  //const splitResult = result[0].split(":");
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.showPendingTranscripts = catchAsync(async (req, res, next) => {
  const data = await User.findAll({
    where: { isTranscriptPending: true },
    attributes: ["username", "first_name", "last_name"],
  });
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getAllClassScheduleOfUser = catchAsync(async (req, res, next) => {
  const username = req.params.username;
  let data = await Grade.findAll({
    where: { username },
    returning: true,
    attributes: [],
    include: [
      {
        model: Class,
        attributes: ["schedules", "class_id"],
        include: [{ model: Course, attributes: ["course_id"] }],
      },
    ],
  });
  const schedulesDict = {};

  // Loop through each class in the data
  for (const item of data) {
    const classData = item.class;
    for (const schedule of classData.schedules) {
      // Extract day, start time, and end time from the schedule string
      const [day, start, end] = schedule
        .match(/(\w+)-(\d+:\d+:\w+)-(\d+:\d+:\w+)/)
        .slice(1);
      // Create an object to store class information

      const classInfo = {
        course_id: classData.course.course_id,
        class_id: classData.class_id,
        start: start,
        end: end,
      };

      // Check if the day is already in the schedulesDict
      if (day in schedulesDict) {
        schedulesDict[day].push(classInfo);
      } else {
        schedulesDict[day] = [classInfo];
      }
    }
  }

  // Create the final array of schedules
  let finalArray = [];
  for (const day in schedulesDict) {
    const daySchedule = { [day]: schedulesDict[day] };
    finalArray.push(daySchedule);
  }

  //Create the final object with "schedules" key
  // Create an array to map day names to corresponding day numbers
  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Sort the schedules array based on day order using a custom sorting function
  finalArray.sort((a, b) => {
    const dayA = Object.keys(a)[0]; // Get the day name from the first key of object a
    const dayB = Object.keys(b)[0]; // Get the day name from the first key of object b

    return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB); // Compare day names based on day order
  });

  data = { schedules: finalArray };
  res.status(200).json({
    data,
    status: "success",
  });
});
