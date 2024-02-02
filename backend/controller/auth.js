var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../model/user");

const registerUser = async (req, res) => {
  try {
    //get all the data from frontend
    const { firstname, lastname, email, password } = req.body;
    console.log(req.body);
    console.log(firstname, lastname, email, password);

    //check all the data should exist
    if (!firstname && !lastname && !email && !password) {
      return res.status(400).send("please enter all required fields!");
    }
    //check if the user already exist or not
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(200).send("user with this email already exist");
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

module.exports = { registerUser };
