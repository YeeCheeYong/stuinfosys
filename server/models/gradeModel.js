const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const User = require("./userModel");
const Class = require("./classModel");

const Grade = sequelize.define("grades", {
  class_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    foreignKey: true,
    references: { model: Class, key: "class_id" },
  },
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    foreignKey: true,
    references: { model: User, key: "username" },
  },
  grade: {
    type: DataTypes.FLOAT,
    defaultValue: null,
  },
});

module.exports = Grade;
