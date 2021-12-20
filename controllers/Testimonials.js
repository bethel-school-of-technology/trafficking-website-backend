var express = require("express");
var router = express.Router();
var models = require("../models");
var mysql = require("mysql2");
var authService = require("../services/auth");
const authMiddleware = require("../middlewares/auth");
const { Op } = require("sequelize");
const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

exports.Testimonials_CreatePost = (req, res, next) => {
  let username = req.profile.username;
  if (username) {
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
  } else {
    res.json({
      message: "Please login. ",
    });
  }
};

exports.Testimonials_AdminApproval = (req, res, next) => {
  let testimonyId = req.params.id;
  let admin = req.profile.admin;
  if (admin) {
    models.Testimonials.update(
      { Approved: new Date() },
      { where: { testimonyId: testimonyId } }
    ).then((result) => {
      res.json({
        message: "successfully approved.",
      });
    });
  } else {
    res.send("You are not authorized to approve this message");
  }
};
exports.Testimonials_delete = (req, res, next) => {
  let testimonyId = req.params.id;
  let admin = req.profile.admin;
  if (admin) {
    models.Testimonials.update(
      { Deleted: true },
      { where: { testimonyId: testimonyId } }
    ).then((result) => {
      res.json({
        message: "Successfully deleted",
      });
    });
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
    ).then((result) => {
      res.json({
        message: "Successfully rejected.",
      });
    });
  } else {
    res.send("You are not authorized to decline this message");
  }
};

exports.testimonials_adminpage_approved = (req , res , next) => {
  let admin = req.profile.admin;

  if(admin){
    models.Testimonials.findAll({
      where: {
        Approved: {
          $gt: sevenDaysAgo,
          $lt: new Date(),
        }
      }
    }).then(testimonialsApproved => {
      res.json({
        message: "query Successful",
        testimonials: testimonialsApproved
      })
    })
  }else{
    res.send('not authorized')
  }
}
exports.testimonials_adminpage_declined = (req , res , next) => {
  let admin = req.profile.admin;

  if(admin){
    models.Testimonials.findAll({
      where: {
        Declined: {
          $gt: sevenDaysAgo,
          $lt: new Date(),
        }
      }
    }).then(testimonialsApproved => {
      res.json({
        message: "query Successful",
        testimonials: testimonialsApproved
      })
    })
  }else{
    res.send('not authorized')
  }
}
exports.testimonials_adminpage_deleted = (req , res , next) => {
  let admin = req.profile.admin;

  if(admin){
    models.Testimonials.findAll({
      where: {
        Deleted: true,
      }
    }).then(testimonialsApproved => {
      res.json({
        message: "query Successful",
        testimonials: testimonialsApproved
      })
    })
  }else{
    res.send('not authorized')
  }
}

exports.testimonials_adminpage_untouched = (req,res,next) => {
  let admin = req.profile.admin;
  if(admin) {
    models.Testimonials.findAll({
      where: {
        Deleted: false,
        Declined: null,
        Approved: null,
      }
    }).then(testimonialsFound => {
      res.json({
        message: "untouched testimonials",
        Testimonials: testimonialsFound
      })
    })
  }else{
    res.json({
      message: "Not authorized."
    })
  }
}