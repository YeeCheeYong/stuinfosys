const User = require("../models/userModel");
const Class = require("../models/classModel");
const Course = require("../models/courseModel");
const Grade = require("../models/gradeModel");

User.hasMany(Class, { foreignKey: "username" });
Class.belongsTo(User, {
  foreignKey: "teacher",
  targetKey: "username",
});

Course.hasMany(Class, { foreignKey: "course_id" });
Class.belongsTo(Course, { foreignKey: "course_id" });

User.hasMany(Grade, { foreignKey: "username" });
Grade.belongsTo(User, { foreignKey: "username" });

// Course.hasMany(Grade, { foreignKey: "course_id" });
// Grade.belongsTo(Course, { foreignKey: "course_id" });

Class.hasMany(Grade, { foreignKey: "class_id" });
Grade.belongsTo(Class, { foreignKey: "class_id" });
