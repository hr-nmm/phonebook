// establishing connection
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
const url =
  process.env.DATABASE_ACCOUNT_URL +
  process.env.DATABASE_PASSWORD +
  process.env.DATABASE_CLUSTER_ID;
console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// schemas
const contactSchema = mongoose.Schema({
  name: String,
  phoneNumber: String,
});
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Contact", contactSchema);
