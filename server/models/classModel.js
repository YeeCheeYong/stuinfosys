const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Class = sequelize.define("classes", {
  class_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.STRING,
    foreignKey: true,
  },
  teacher: {
    type: DataTypes.STRING,
    foreignKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isGoingOn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  pending_students: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  approved_students: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  schedules: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

module.exports = Class;
