var express = require('express');
var router = express.Router();
var db = require('../db');
var models = require('../models');
var User = models('users');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('registration', { title: 'Registration', selectedMenu:'registration', 'success': req.flash('success'), 'error': req.flash('error')});
});

/* GET home page. */
router.get('/userList', function(req, res, next) {
  res.render('contact', { title: 'Contact',success:req.flash('success'),selectedMenu:'contact'});
});

/* Signup form submit */

router.post('/', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('registration', { 
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            password: password,
        });
        
/* Create user */
        User.getUserByEmail(email, function(err, user) {
            if(user){
                req.flash('error', 'Provided email already exsits');
                    res.redirect('registration');    
            }else{
                User.createUser(newUser, function(err, user) {
                    if (err)
                        throw err;
                    req.flash('success', 'You are now registered. Please login.');
                    res.redirect('/login');
                });        
            }
        });
    }

});

module.exports = router;
