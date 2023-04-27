const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.jwtSecret);
  const currentUser = decoded.user;
  const user = await User.findOne({
    where: {
      username: currentUser.username,
    },
  });
  if (user == null)
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  req.user = {
    role: user.role,
    username: user.username,
  };
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'moderator']
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    next();
  };
};
