const express = require("express");
require("dotenv").config();
const { DBConnection } = require("./database/db");

const { authRoutes } = require("./routes/auth");
const { default: mongoose } = require("mongoose");
//middlewares

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = express.Router();
app.use(routes);
DBConnection();
app.use("/api/auth", authRoutes);

app.listen(8000, () => {
  console.log("server listen in 8080");
});
