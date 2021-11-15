var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//signup route
router.post('/signup', function (req, res, next) {
    models.businesses
        .findOrCreate({
            where: {
                Username: req.body.Username
            },
            defaults: {
                ContactName: req.body.ContactName,
                Email: req.body.Email,
                Password: authService.hashPassword(req.body.Password),
                BusinessURL: req.body.BusinessURL
            }
        })
        .spread(function (result, created) {
            if (created) {
                res.send('Created Business Successfully.');
            } else {
                res.send('This Business already exists.');
            }
        });
});
//login route
router.post('/login', function (req, res, next) {
    models.businesses.findOne({
        where: {
            Username: req.body.Username
        }
    }).then(business => {
        if(!business){
            console.log('Business not found.')
            res.status(401).json({
                message: 'login failed.'
            });
        }else{
            let passwordMatches = authService.comparePasswords(req.body.Password, business.Password);
            if(passwordMatches){
                let token = authService.signUser(business);
                res.cookie('jwt', token);
                res.send('Login Successful!');
            }else{
                console.log('Invalid password, please try again.')
                res.send('Wrong Password, try again.')
            }
        }
    });
});
router.post('/posts', function(req,res,next){
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(business => {
            models.testimonials.create({
                where: {
                    Synopsis: req.body.Synopsis,
                    Title: req.body.Title,
                    Body: req.body.Body,
                    BusinessId: business.BusinessId
                }
            }).spread(function(result,created) {
                if(created){
                    res.send('Post created');
                }else{
                    res.send('post creation failed')
                }
            })
        })
})
//get all businesses route

//logout route
router.get('/logout', function(req,res,next) {
    res.cookie('jwt', "", {expires: new Date(0) });
    res.send('logged out');
});




module.exports = router;