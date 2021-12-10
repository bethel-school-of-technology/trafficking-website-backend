const jwt = require("jsonwebtoken");
const models = require("../models");
const bcrypt = require("bcryptjs");

var authService = {
  signUser: function (business) {
    const token = jwt.sign(
      {
        UserName: business.UserName,
        UserId: business.BusinessId,
      },
      "secretkey",
      {
        expiresIn: "1h",
      }
    );
    return token;
  },
  verifyUser: function (token) {
    // try {
        console.log("TRY")
      let decoded = jwt.verify(token, "secretkey");
      console.log(decoded)
    return models.businesses.findByPk(decoded.UserId);
  
    
    // } catch (err) {
    //   console.log(err)
    //   console.log("CATCH")
    //   return err;
    // }
  },
  hashPassword: function (plainTextPassword) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainTextPassword, salt);
    return hash;
  },
  comparePasswords: function (plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  },
};

module.exports = authService;
