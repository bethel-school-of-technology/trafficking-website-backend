var express = require('express');
var router = express.Router();
var models = require('../models');
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
//logout route
router.get('/logout', function(req,res,next) {
    res.cookie('jwt', "", {expires: new Date(0) });
    res.send('logged out');
});




module.exports = router;