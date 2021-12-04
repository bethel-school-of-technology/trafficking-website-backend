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
//Profile route
router.get('/profile', businessesController.businesses_profile);
//admin page 
router.get('/admin', businessesController.Businesses_Admin);
//update your Profile
router.put('/profile/:id', businessesController.businesses_profile_update);
//finds orgs by zip code.
router.get('/getinvolved', businessesController.businesses_findbyZip);





module.exports = router;