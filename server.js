const { config, dbConnect } = require("./config/connect");
const app = require("./express");

// database connection
dbConnect();

const server = app.listen(config.port, (err) => {
  if (err) throw err;
  console.log(
    `Server is listening on port ${config.port}... and Application is on ${config.env} mode`
  );
});

module.exports = server;
