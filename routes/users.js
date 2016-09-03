var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models('users');
/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
   var id = req.user.id;
    User.getUserById(id, function(err, user) {
    res.render('users', {title: 'Edit Profile',selectedMenu:'users', userDetails: user, errors: []});
    });
});

/* Update profile  */
router.get('/users', ensureAuthenticated, function(req, res, next) {
    var id = req.user.id;
    User.getUserById(id, function(err, user) {
    res.render('users', {title: 'Edit Profile',selectedMenu:'users', userDetails: user, errors: []});
    });
});

/* Update profile  */
router.post('/users', ensureAuthenticated, function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    // Form Validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();
    var id = req.user.id;
    if (errors) {
    	User.getUserById(id, function(err, user) {
            res.render('users', {title: 'Edit Profile',selectedMenu:'users', taskDetails: taskDetails, errors: errors});
        });
    } else {
        if(!password)
        	var data = {
            	name: name,
            	email: email
        	};
        else
        	var data = {
            	name: name,
            	email: email,
            	password: password
        	};

        /* Update user */
        User.updateUser(id, data, function(err, Task) {
            if (err)
                throw err;
            console.log(err);
            req.flash('success', 'Your profile has been successfully updated.');
            res.redirect('users');
        });

    }

});


/* For check Authentication */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    }
    res.redirect('/login');
}

module.exports = router;
