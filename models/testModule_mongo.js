const mongoose = require("mongoose");
require("dotenv").config();
if (process.argv.length < 2) {
  console.log(`give password as argument`);
  process.exit(1);
}

const url =
  process.env.DATABASE_ACCOUNT_URL +
  process.env.DATABASE_PASSWORD +
  process.env.DATABASE_CLUSTER_ID;
mongoose.set("strictQuery", false);
mongoose.connect(url);

// create schema for model
const contactSchema = mongoose.Schema({
  name: String,
  phoneNumber: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// if 2 args given => show all documents in collection contacts
if (process.argv.length < 4) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else {
  // if 4 args given => create document
  const contactName = process.argv[2],
    contactNumber = process.argv[3];
  const contact = new Contact({
    name: contactName,
    phoneNumber: contactNumber,
  });

  contact.save().then((result) => {
    console.log("note saved!", result);
    mongoose.connection.close();
  });
}
