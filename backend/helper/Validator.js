const User = require("../model/user");
class Validator {
  //isInputvalid
  //input shouldnt be empty
  //email format should be correct
  validator() {}
  inputValidation(inputs) {
    const arrayOfInputs = Object.keys(inputs);
    console.log("in vlidator");
    console.log(inputs);

    for (let i = 0; i < arrayOfInputs.length; i++) {
      const inputKey = arrayOfInputs[i];
      const input = inputs[inputKey];
      if (!input) {
        return {
          isInputValid: false,
          msg: `${input} field cannot be empty`,
        };
      }
      if (inputKey === "email") {
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input) == false
        ) {
          return {
            isInputValid: false,
            msg: "email address is not valid",
          };
        }
      }
    }
    return {
      isInputValid: true,
    };
  }

  async getUser(email, { attempt }) {
    const user = await User.findOne({ email });
    if (user) {
      if (attempt === "logIn") {
        return {
          isNewUserEntry: false,
          userData: user,
          msg: "user exist we are good to login",
        };
      } else {
        return {
          isNewUserEntry: false,
          userData: user,
          msg: "user already exist try signup with other email",
        };
      }
    } else {
      if (attempt === "logIn") {
        return {
          isNewUserEntry: true,
          userData: null,
          msg: "user not exist",
        };
      } else {
        return {
          isNewUserEntry: true,
          userData: null,
          msg: "email not found we are good to signup",
        };
      }
    }
  }
}
module.exports = { Validator };
