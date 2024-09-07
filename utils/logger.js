const morgan = require("morgan");
const config = require("./config");
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
};
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
};

// morgan middleware - for logging requests
morgan.token("hostname", (req, _) => {
  return `Server running on ${req.hostname}:${config.PORT}`;
});
morgan.token("data", (req, _) => {
  return JSON.stringify(req.body);
});

// logging/handling unknown endpoints and errors
// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// error handler middleware
const errorHandler = (error, _, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") return response.status(400).send({ error: "malformatted mongo id" });
  else if (error.name === "ValidationError") return response.json({ error: error.message });
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) return response.status(400).json({ error: 'expected `username` to be unique' })
  else if (error.name === 'JsonWebTokenError') return response.status(401).json({ error: 'token invalid' })
  else if (error.name === 'TokenExpiredError') return response.status(401).json({ error: 'token expired' })


  next(error);
};
module.exports = { info, error, morgan, unknownEndpoint, errorHandler };
