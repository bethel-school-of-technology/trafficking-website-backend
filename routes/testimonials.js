var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');
const TestimonialsController = require('../controllers/Testimonials');
//create post route
router.post('/posts', TestimonialsController.Testimonials_CreatePost,  (req, res, next) => {
})

router.get('/posts/:id/approval', TestimonialsController.Testimonials_AdminApproval, (req, res, next) => {
})

module.exports = router;