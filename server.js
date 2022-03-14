const { config, dbConnect } = require("./config/connect");
const server = require("./express");


// database connection
dbConnect();

server.listen(config.port, (err) => {
  if (err) throw err;
  console.log(
    `Server is listening on port ${config.port}... and Application is on ${config.env} mode`
  );
});
