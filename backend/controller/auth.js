var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../model/user");
const { Validator } = require("../helper/Validator");

const registerUser = async (req, res) => {
  try {
    //get all the data from frontend
    const { firstname, lastname, email, password } = req.body;
    console.log(req.body);
    console.log(firstname, lastname, email, password);

    //check all the data should exist

    const validator = new Validator();
    const { getUser, inputValidation } = validator;
    const { isInputValid, msg: inputValidationMsg } = inputValidation({
      firstname,
      lastname,
      email,
      password,
    });
    if (!isInputValid) {
      return res.status(400).json({ msg: inputValidationMsg });
    }
    //check if the user already exist or not

    const { isNewUserEntry, msg } = await getUser(email, { attempt: "signUp" });
    if (!isNewUserEntry) {
      return res.status(400).json({ msg });
    }

    //encrypt the user password
    const hashPassword = await bcrypt.hash(password, 10);

    // save the user data into db
    const userData = await User.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });

    //generate a token  fr user and sent it(JWT token)
    const token = jwt.sign({ id: User._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    userData.token = token;
    userData.password = undefined;
    res.status(200).json({
      message: "You have successfully registered!",
    });
  } catch (error) {
    console.log("Error :" + error.message);
  }
};
const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const validator = new Validator();
    const { inputValidation, getUser } = validator;
    const { isInputValid, msg: inputValidationMessage } = inputValidation({
      email,
      password,
    });
    console.log(isInputValid);
    if (!isInputValid) {
      return res.status(400).json({ msg: inputValidationMessage });
    }
    //check if user exist or not
    const { userData, isNewUserEntry, msg } = await getUser(email, {
      attempt: "logIn",
    });
    if (isNewUserEntry) {
      return res.status(400).json({ msg });
    }

    //compare database password and input password
    const isPasswordValid = bcrypt.compareSync(
      password.toString(),
      userData.password.toString()
    );
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "invalid password" });
    }
    //create token
    const token = jwt.sign({ id: User._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    userData.token = token;
    userData.password = undefined;
    return res.status(200).json({
      userData,
      msg: "login successful",
      accessToken: token,
    });
  } catch (error) {
    console.log("Error :" + error);
  }
};
module.exports = { registerUser, logInUser };
