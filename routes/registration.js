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
    var name = req.body.userData.name;
    var email = req.body.userData.email;
    var password = req.body.userData.password;
    var newUser = new User({
            name: name,
            email: email,
            password: password,
    });
        
    /* Create user */
    User.getUserByEmail(email, function(err, user) {
        if(user){
            var response = {
                status:'false',
                message:'Email already exits'
            }
            res.send(response);
        }else{
            User.createUser(newUser, function(err, user) {
                if (err)
                    throw err;
                var response = {
                        status:'true',
                    }
                res.send(response);
            });        
        }
    });
});

module.exports = router;
