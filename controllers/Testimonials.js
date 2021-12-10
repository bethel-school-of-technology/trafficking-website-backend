var express = require("express");
var router = express.Router();
var models = require("../models");
var mysql = require("mysql2");
var authService = require("../services/auth");
const authMiddleware = require('../middlewares/auth');

exports.Testimonials_CreatePost = (req, res, next) => {
    let username = req.profile.username;
    if(username){
        models.Testimonials.findOrCreate({
            where: {
              Synopsis: req.body.Synopsis,
              Title: req.body.Title,
              Body: req.body.Body,
              BusinessId: req.profile.businessId,
            },
          }).spread((result, created) => {
            if (created) {
              // res.send('Post created');
              res.json({
                message: "Post Created, pending approval.",
                post: result,
              });
            } else {
              res.send("post creation failed");
            }
          });
        }else{
            res.json({
                message: "Please login. "
            })
        }
    }

exports.Testimonials_AdminApproval = (req, res, next) => {
  let testimonyId = req.params.id;
 let admin = req.profile.admin;
    if (admin) {
      models.Testimonials.update(
        { Approved: new Date() },
        { where: { testimonyId: testimonyId } }
      ).then(result => {
          res.json({
              message: "successfully approved."
          })
      })
    } else {
      res.send("You are not authorized to approve this message");
    }
 
};
exports.Testimonials_delete = (req, res, next) => {
  let testimonyId = req.params.id;
 let admin = req.profile.admin
    if (admin) {
      models.Testimonials.update(
        { Deleted: true },
        { where: { testimonyId: testimonyId } }
        
      ).then(result => {
          res.json({
              message: "Successfully deleted"
          })
      })
    } else {
      res.send("You are not authorized to delete this message");
    }

};
exports.Testimonials_AdminRejection = (req, res, next) => {
  let testimonyId = req.params.id;
  let admin = req.profile.admin;
    if (admin) {
      models.Testimonials.update(
        { Declined: new Date() },
        { where: { testimonyId: testimonyId } }
      ).then(result => {
          res.json({
              message: "Successfully rejected."
          })
      })
    } else {
      res.send("You are not authorized to decline this message");
    }

};
