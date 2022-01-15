const config = require("./config/config");
const server = require("./express");

const dbConnect = require("./models/connect");

// database connection
dbConnect();

server.listen(config.port, (err) => {
  if (err) throw err;
  console.log(
    `Server is listening on port ${config.port}... and Application is on ${config.env} mode`
  );
});
