"use strict";
require("dotenv").config();
require("./db");
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

// Importing the express app
const app = require("./app");
// const DB = require('./db/dbConnect');

// Starting the server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}`);
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down the server...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
