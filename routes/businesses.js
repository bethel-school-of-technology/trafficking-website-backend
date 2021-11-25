var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');
const businessesController = require('../controllers/Businesses');
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//signup route
router.post('/signup', businessesController.businessess_sign_up);
//login route
router.post('/login',businessesController.businesses_login);
//get all businesses route
router.get('/organizations', businessesController.businesses_getAll);
//logout route
router.get('/logout', businessesController.businesses_logout);




module.exports = router;