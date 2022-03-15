const express = require("express");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

//Routes middleware
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);

module.exports = app;
