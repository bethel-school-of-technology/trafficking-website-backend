var express = require("express");
var router = express.Router();
var models = require("../models");
var mysql = require("mysql2");
var authService = require("../services/auth");
const { DATE } = require("sequelize");

exports.businessess_sign_up = (req, res, next) => {
  console.log(req.body);
  const regexPassword = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/;
  const regexUsername = /^[a-z][^\W_]{7,14}$/i;
  const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;
  const regexURL =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

  if (
    req.body.Username.match(regexUsername) &&
    req.body.Password.match(regexPassword) &&
    req.body.Email.match(regexEmail) &&
    req.body.BusinessURL.match(regexURL)
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
          res.send("Created Business Successfully.");
        } else {
          res.send("This Business already exists.");
        }
      });
  } else {
    res.status(401);
    res.send("Wrong");
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
          res.send("Login Successful!");
        } else {
          console.log("Invalid password, please try again.");
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
      res.send(JSON.stringify(BusinessesFound));
    });
};
exports.businesses_logout = (req, res, next) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.send("logged out");
};
exports.businesses_profile = (req, res, next) => {
  let token = req.cookies.jwt;
  authService.verifyUser(token).then((user) => {
    models.businesses
      .findOne({
        where: {
          Username: user.Username,
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
        res.send(userFound);
      });
  });
};
exports.Businesses_Admin = (req, res, next) => {
  let token = req.cookies.jwt;
  authService.verifyUser(token).then((user) => {
    if (user.Admin) {
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
              required: false,
              attributes: ["Title", "Body", "Synopsis"],
            },
          ],
        })
        .then((usersFound) => {
          res.send(JSON.stringify(usersFound));
        });
    } else {
      res.send("You are not an admin.");
    }
  });
};
exports.businesses_profile_update = (req, res, next) => {
  let token = req.cookies.jwt;
  authService.verifyUser(token).then((user) => {
    models.businesses
      .update(
        {
          ContactName: req.body.ContactName,
          OrganizationName: req.body.OrganizationName,
          Username: req.body.Username,
          BusinessURL: req.body.BusinessURL,
          ZipCode: req.body.ZipCode,
        },
        { where: { BusinessId: req.params.id } }
      )
      .then((updatedProfile) => {
        res.send(JSON.stringify(updatedProfile));
      });
  });
};
exports.businesses_findbyZip = (req,res,next) => {
    models.businesses 
        .findAll({
            where: {ZipCode: req.body.ZipCode},
            attributes: ["ContactName", "OrganizationName", "BusinessURL"],
        include: [
            {
                model: model.Testimonials,
                required: false,
                attributes: ["Title", "Synopsis", "Body"],
            }
        ]
        }).then(BusinessesFound => {
            if(BusinessesFound){
                res.send(JSON.stringify(BusinessesFound));
            }else{
                res.send('There are no organizations that match that have that as their Zip Code.');
            }
            
        });
};
