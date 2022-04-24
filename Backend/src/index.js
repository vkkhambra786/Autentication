const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json()); //integrating json into app
const authController = require("./routes/auth.routes");
app.use("/blog",authController); //defult api to hit userController

module.exports = app;
