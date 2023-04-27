const Sequelize = require("sequelize");
require("dotenv").config();
const DB_URI = process.env.DB_URI;
const sequelize = new Sequelize(DB_URI, {
  logging: console.log,
  define: {
    timestamps: true,
  },
  dialect: "postgres",
  timezone: "utc",
});

(async () => {
  try {
    await sequelize.authenticate();
    //await sequelize.sync({ force: true });
    //await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

module.exports = sequelize;
