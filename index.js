const app = require("./app"); // the actual Express application
const config = require("./utils/config");
const logger = require("./utils/logger");
// server run/listen

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
