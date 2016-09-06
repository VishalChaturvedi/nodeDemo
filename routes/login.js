var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db');
var models = require('../models');
var User = models('users');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Demo App', selectedMenu:'login', 'success': req.flash('success'), 'error': req.flash('error') });
});


/* Make login  */
router.post('/',
        passport.authenticate('local', {
            
            failureRedirect: '/login', failureFlash: 'Invalid email or password'}

            ),
function(req, res) {
   // req.flash('success', 'You are now logged in');
    req.flash('userRole', req.user.userRole);
   // res.redirect('/admin/');
    var response = {
        status:'ture'
    }
    res.send(response);
    
    /* if(req.user.userRole == "0"){
        res.redirect('/admin/');
    }else{
        res.redirect('/users');
    } */
});

router.post('/api', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        var response = {
            status:'false',
            message:err
        }
    res.send(response);
    }
    if (!user) { 
        var response = {
            status:'false',
            message:"Email and paassword are not match"
        }
    res.send(response);
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      req.flash('userRole', req.user.userRole);
      var response = {
            status:'true'
        }
    res.send(response);
    });
  })(req, res, next);
});

/* Passport serealize function*/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/* Passport desialize function */
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

/* Passport local strategy */
passport.use(
        new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function(username, password, done) {
    User.getUserByEmail(username, function(err, user) {
        if (err)
            throw err;
        if (!user) {
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err)
                return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid Password'});
            }
        });
    });
}));

module.exports = router;
