var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');

//create post route
router.post('/posts', function(req,res,next){
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
            }).spread(function(result,created) {
                if(created){
                    res.send('Post created');
                }else{
                    res.send('post creation failed')
                }
            })

        })
})

module.exports = router;