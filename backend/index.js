const express = require("express");
require("dotenv").config();
const { DBConnection } = require("./database/db");
const User = require("./model/user");
const { default: mongoose } = require("mongoose");
var bcrypt = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 8080;
DBConnection();
app.post("/signup", async (req, res) => {
  //get all the data from frontend
  const { firstname, lastname, email, password } = req.body;

  //check all the data should exist
  if (!(firstname && lastname && email && password)) {
    return res.status(400).send("please enter all required fields!");
  }
  //check if the user already exist or not
  const isUserExist = await User.findOne(email);
  if (isUserExist) {
    return res.status(200).send("user with this email already exist");
  }

  //encrypt the user password
  const hashPassword = await bcrypt.hash(password, 10);
  const userData = await User.create({
    firstname,
    lastname,
    email,
    password: hashPassword,
  });

  // save the user data into db
  //generate a token  fr user and sent it(JWT token)
});
app.post("/login", (req, res) => {
  res.send("login page");
});

app.listen(8000, () => {
  console.log("server listen in 8080");
});
