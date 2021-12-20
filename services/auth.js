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
    let decoded = jwt.verify(token, "secretkey");
    return models.businesses.findByPk(decoded.UserId);
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
