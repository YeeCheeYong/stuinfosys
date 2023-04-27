const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Course = sequelize.define("courses", {
  course_id: {
    type: DataTypes.STRING,
    noUpdate: true,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  credit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  prerequisites: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

module.exports = Course;
