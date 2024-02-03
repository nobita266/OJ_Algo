const express = require("express");
const authRoutes = express.Router();
const bodyParser = require("body-parser");
const { registerUser, logInUser } = require("../controller/auth");

authRoutes.use(express.urlencoded({ extended: true }));
authRoutes.use(express.json());
// authRoutes.post("/login", logInUser);
authRoutes.post("/signUp", registerUser);
authRoutes.post("/logIn", logInUser);
module.exports = { authRoutes };
