var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql2')
var authService = require('../services/auth');
const businessesController = require('../controllers/Businesses');
const authMiddleware = require("../middlewares/auth")

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
router.get('/profile', authMiddleware.verify, businessesController.businesses_profile);
//admin page 
router.get('/admin', authMiddleware.verify, businessesController.businesses_Admin)
// router.get('/admin', authMiddleware.verify, businessesController.Businesses_Admin);
//update your Profile
router.put('/profile', authMiddleware.verify, businessesController.businesses_profile_update);
//finds orgs by zip code.
router.get('/getinvolved/:ZipCode', businessesController.businesses_findbyZip);
//admin delete user
router.get('/admin/deleteuser/:id', businessesController.adminDeleteUser);

router.get("/test", authMiddleware.verify, businessesController.test);




module.exports = router;