var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');

exports.Testimonials_CreatePost = (req, res, next) => {
    console.log(req.cookies);
    console.log(req.body);
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(business => {
            models.Testimonials.findOrCreate({
                where: {
                    Synopsis: req.body.Synopsis,
                    Title: req.body.Title,
                    Body: req.body.Body,
                    BusinessId: business.BusinessId
                }
            }).spread((result, created) => {
                if (created) {
                    // res.send('Post created');
                    res.json({
                        message: "Post Created, pending approval.",
                        post: result
                    });
                } else {
                    res.send('post creation failed');
                };
            });

        });
};

exports.Testimonials_AdminApproval = (req, res, next) => {
    let testimonyId = req.params.id;
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(user => {
            if (user.Admin) {
                models.Testimonials.update(
                    { Approved: new Date() },
                    { where: { testimonyId: testimonyId } })
            } else {
                res.send('You are not authorized to approve this message');
            };
        });
};
exports.Testimonials_delete = (req, res, next) => {
    let testimonyId = req.params.id;
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(user => {
            if (user.Admin) {
                models.Testimonials.update(
                    { Deleted: true},
                    { where: { testimonyId: testimonyId } })
            } else {
                res.send('You are not authorized to delete this message');
            };
        });
};
exports.Testimonials_AdminRejection = (req,res,next) => {
    let testimonyId = req.params.id;
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(user => {
            if (user.Admin) {
                models.Testimonials.update(
                    { Declined: new Date() },
                    { where: { testimonyId: testimonyId } })
            } else {
                res.send('You are not authorized to decline this message');
            };
        });
};

