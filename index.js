const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 3001;
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
morgan.token("hostname", (req, _) => {
  return `Server running on ${req.hostname}:${PORT}`;
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
app.get("/api/persons", (_, res) => res.json(persons));

// fetch info
app.get("/api/info", (_, res) => {
  res.send(
    `<p>
      Phonebook has info for ${persons.length} people <br />
      ${new Date()}
    </p>`
  );
});

// get single resource
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  person ? res.json(person) : res.sendStatus(404).end("<p>enter valid url</p>");
});

// delete resource
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.sendStatus(240).end();
});

// create resource
const generateID = () => Math.floor(Math.random() * 10000000 + 1).toString();
app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (
    !body.name ||
    !body.number ||
    persons.find((person) => person.name === body.name)
  ) {
    return res.status(400).json({
      error: "content missing/duplicate",
    });
  }
  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

app.listen(PORT, () => {
  console.log(`ran successfully`);
});
