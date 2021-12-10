var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');
const authMiddleware = require("../middlewares/auth");
const TestimonialsController = require('../controllers/Testimonials');
//create post route
router.post('/posts', authMiddleware.verify, TestimonialsController.Testimonials_CreatePost);
router.get('/posts/:id/approval', authMiddleware.verify, TestimonialsController.Testimonials_AdminApproval);
router.get('/posts/:id/decline',authMiddleware.verify, TestimonialsController.Testimonials_AdminRejection);
router.get('/posts/:id/delete', authMiddleware.verify, TestimonialsController.Testimonials_delete);

module.exports = router;