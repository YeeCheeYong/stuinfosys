const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("users", {
  username: {
    type: DataTypes.STRING,
    noUpdate: true,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "student",
  },
  description: {
    type: DataTypes.TEXT,
  },
  gpa: {
    type: DataTypes.FLOAT,
    default: 0.0,
  },
  transcript_grades: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isTranscriptPending: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = User;
