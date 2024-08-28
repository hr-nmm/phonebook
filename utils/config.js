require("dotenv").config();
const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.DATABASE_ACCOUNT_URL +
  process.env.DATABASE_PASSWORD +
  process.env.DATABASE_CLUSTER_ID;
const MORGAN_SPEC = process.env.LOGGER_SPEC;
module.exports = {
  MONGODB_URI,
  PORT,
  MORGAN_SPEC,
};
