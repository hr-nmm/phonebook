require("dotenv").config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.DATABASE_ACCOUNT_URL + process.env.DATABASE_PASSWORD + process.env.TEST_DATABASE_CLUSTER_ID : process.env.DATABASE_ACCOUNT_URL + process.env.DATABASE_PASSWORD + process.env.DATABASE_CLUSTER_ID
const MORGAN_SPEC = process.env.LOGGER_SPEC;
const SECRET = process.env.SECRET

module.exports = { MONGODB_URI, PORT, MORGAN_SPEC, SECRET };
