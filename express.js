const express = require("express");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const server = express();

//middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(compress());
server.use(helmet());
server.use(cors());

//Routes middleware
server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);

module.exports = server;
