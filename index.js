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
app.get("/api/persons", (_, res) => {
  Contact.find({}).then((result) => {
    res.json(result);
  });
});

// fetch info
app.get("/api/info", (_, res) => {
  Contact.estimatedDocumentCount().then((result) => {
    res.send(
      `<p>
        Phonebook has info for ${result} people <br />
        ${new Date()}
      </p>`
    );
  });
});

// get single resource
app.get("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id).then((contact) => {
    res.json(contact);
  });
});

// delete resource
app.delete("/api/persons/:id", (req, res) => {
  Contact.findByIdAndDelete(req.params.id).then((result) => {
    res.json(result);
  });
});

// create resource
app.post("/api/persons/", (req, res) => {
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
  contact.save().then((savedContact) => {
    res.json(savedContact);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`ran successfully`);
});
