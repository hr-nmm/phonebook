const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(cors());
app.use(express.static("dist"));

// MONGO - create schema for model
const Contact = require("./models/contact");

app.use(express.json());
morgan.token("hostname", (req, _) => {
  return `Server running on ${req.hostname}:${process.env.PORT}`;
});
morgan.token("data", (req, _) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":hostname :method :url :status :res[content-length] - :response-time ms :data"
  )
);

// fetch all persons
app.get("/api/persons", (_, res, next) => {
  Contact.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

// fetch info
app.get("/api/info", (_, res, next) => {
  Contact.estimatedDocumentCount()
    .then((result) => {
      res.send(
        `<p>
        Phonebook has info for ${result} people <br />
        ${new Date()}
      </p>`
      );
    })
    .catch((error) => next(error));
});

// get single resource
app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// delete resource
app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// create resource
app.post("/api/persons/", (req, res, next) => {
  const body = req.body;
  if (body.name === undefined) {
    return res.status(400).json({
      error: "content missing/duplicate",
    });
  }
  const contact = new Contact({
    name: body.name,
    phoneNumber: body.phoneNumber,
  });
  contact
    .save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch((error) => next(error));
});

// update resource
app.put("/api/persons/:id", (request, response, next) => {
  const { name, phoneNumber } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, phoneNumber },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// error handler middleware
const errorHandler = (error, _, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted mongo id" });
  } else if (error.name === "ValidationError") {
    return response.json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`ran successfully`);
});
