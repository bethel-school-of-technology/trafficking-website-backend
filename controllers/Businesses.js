var express = require("express");
var router = express.Router();
var models = require("../models");
var mysql = require("mysql2");
var authService = require("../services/auth");
const { Op } = require("sequelize");

exports.test = (req, res, next) => {
  console.log(req.profile);
  res.json({
    message: "OK",
    admin: req.header.admin,
    username: req.header.username,
  });
};

exports.businessess_sign_up = (req, res, next) => {
  console.log(req.body);
  const regexPassword = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/;
  const regexUsername = /^[a-z][^\W_]{7,14}$/i;
  if (
    req.body.Username.match(regexUsername) &&
    req.body.Password.match(regexPassword)
  ) {
    models.businesses
      .findOrCreate({
        where: {
          Username: req.body.Username,
        },
        defaults: {
          ContactName: req.body.ContactName,
          Email: req.body.Email,
          Password: authService.hashPassword(req.body.Password),
          BusinessURL: req.body.BusinessURL,
          OrganizationName: req.body.OrganizationName,
          ZipCode: req.body.ZipCode,
        },
      })
      .spread(function (result, created) {
        if (created) {
          res.json({
            message: "Business created successfully",
            business: result,
          });
        } else {
          res.send("This Business already exists.");
        }
      });
  } else {
    res.status(401);
    res.json({
      message:
        "Username: Must be 8-15 characters and must start with a letter -May not contain special characters only letters and numbers, Password: Must be 5-20 characters long, Must contain at least one lower-case letter (abcdefghijklmnopqrstuvwxyz), Must contain at least one number (0123456789) Must not contain a colon (:); an ampersand (&); a period (.); a tilde (~); or a space.",
    });
  }
};
//username: /^[a-z][^\W_]{7,14}$/i
// password: /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/
exports.businesses_login = (req, res, next) => {
  models.businesses
    .findOne({
      where: {
        Username: req.body.Username,
      },
    })
    .then((business) => {
      if (!business) {
        console.log("Business not found.");
        res.status(401).json({
          message: "login failed.",
        });
      } else {
        let passwordMatches = authService.comparePasswords(
          req.body.Password,
          business.Password
        );
        if (passwordMatches) {
          let token = authService.signUser(business);
          res.cookie("jwt", token);
          res.status(200).json({
            message: "login successful",
            organization: business,
            token: token,
          });
        } else {
          console.log("Invalid password, please try again.");
          res.status(401);
          res.send("Wrong Password, try again.");
        }
      }
    });
};
exports.businesses_getAll = (req, res, next) => {
  models.businesses
    .findAll({
      where: { admin: null },
      attributes: ["OrganizationName", "BusinessURL"],
      include: [
        {
          model: models.Testimonials,
          required: false,
          attributes: ["Title", "Synopsis", "Body"],
          where: { Deleted: false },
        },
      ],
    })
    .then((BusinessesFound) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: "data:",
        business: BusinessesFound,
      });
    });
};
exports.businesses_logout = (req, res, next) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.send("logged out");
};
//profile
exports.businesses_profile = (req, res, next) => {
  let username = req.profile.username;
  if (username) {
    models.businesses
      .findOne({
        where: {
          Username: username,
        },
        attributes: ["ContactName", "OrganizationName", "Username"],
        include: [
          {
            model: models.Testimonials,
            required: false,
            attributes: ["Title", "Body", "Synopsis"],
          },
        ],
      })
      .then((userFound) => {
        res.json({
          message: "here is profile",
          user: userFound,
        });
      });
  } else {
    res.json({
      message: "User profile not found",
    });
  }
};
exports.businesses_Admin = (req, res, next) => {
  let admin = req.profile.admin;
  console.log("admin " + admin);
  if (admin) {
    models.businesses
      .findAll({
        where: { Admin: null },
        attributes: [
          "BusinessId",
          "ContactName",
          "OrganizationName",
          "Username",
        ],
        include: [
          {
            model: models.Testimonials,
            where: {
              Deleted: false,
              Declined: null,
              Approved: null,
            },
            required: false,
            attributes: ["testimonyId", "Title", "Body", "Synopsis"],
          },
        ],
      })
      .then((usersFound) => {
        res.json({
          message: "Admin info:",
          business: usersFound,
        });
      });
  } else {
    res.json({
      message: "not auth",
    });
  }
};

exports.businesses_profile_update = (req, res, next) => {
  let businessId = req.profile.businessId;
  models.businesses
    .update(
      {
        ContactName: req.body.ContactName,
        OrganizationName: req.body.OrganizationName,
        Username: req.body.Username,
        BusinessURL: req.body.BusinessURL,
        ZipCode: req.body.ZipCode,
      },
      { where: { BusinessId: businessId } }
    )
    .then((updatedProfile) => {
      res.json({
        message: "successfully updated profile",
        profile: updatedProfile,
      });
    });
};
exports.businesses_findbyZip = (req, res, next) => {
  console.log(req.body);
  models.businesses
    .findAll({
      where: { ZipCode: req.params.ZipCode },
      attributes: ["ContactName", "OrganizationName", "BusinessURL", "ZipCode"],
      include: [
        {
          model: models.Testimonials,
          required: false,
          attributes: ["testimonyId", "Title", "Synopsis", "Body"],
        },
      ],
    })
    .then((BusinessesFound) => {
      console.log(req.body.ZipCode);
      if (BusinessesFound) {
        res.json({
          message: "Here are businesses",
          businesses: BusinessesFound,
        });
      } else {
        res.send(
          "There are no organizations that match that have that as their Zip Code."
        );
      }
    });
};
exports.adminDeleteUser = (req, res, next) => {
  let admin = req.profile.admin;
  let BusinessId = req.params.id;

  if (admin) {
    models.businesses.update(
      { Deleted: true },
      { where: { BusinessId: BusinessId } }
    );
  } else {
    res.send("You are not permitted to delete this user.");
  }
};
