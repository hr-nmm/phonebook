const personsRouter = require("express").Router();
const Contact = require("../models/contact");
const User = require("../models/user")
// fetch all persons
personsRouter.get("/", async (_, res, next) => {
  const contacts = await Contact.find({}).populate("user", { username: 1, name: 1 })
  res.json(contacts)
});

// fetch info
personsRouter.get("/info", (_, res, next) => {
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
personsRouter.get("/:id", (req, res, next) => {
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
personsRouter.delete("/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// create resource
personsRouter.post("/", async (req, res, next) => {
  const body = req.body;
  if (body.name === undefined) {
    return res.status(400).json({
      error: "content missing/duplicate",
    });
  }
  const user = await User.findById(body.userId)
  const contact = new Contact({
    name: body.name,
    phoneNumber: body.phoneNumber,
    user: user.id
  });
  try {
    const user = await User.findById(body.userId)
    const savedContact = await contact.save()
    user.contacts = user.contacts.concat(savedContact._id)
    await user.save()
    res.status(201).json(savedContact)
  } catch (exception) {
    next(exception)
  }
});

// update resource
personsRouter.put("/:id", (request, response, next) => {
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
module.exports = personsRouter;
