// imports
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const personsRouter = require("./controller/persons");
const usersRouter = require('./controller/users');
const loginRouter = require("./controller/login");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

// connect to DB
mongoose.set("strictQuery", false);
logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// use middlewares
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(logger.morgan(config.MORGAN_SPEC));
app.use("/api/persons", personsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(logger.unknownEndpoint);
app.use(logger.errorHandler);

module.exports = app;
