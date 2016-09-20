var express = require('express');
var router = express.Router();
var emailServer = require("emailjs/email");
var Contact = require('../models/contact');
var models = require('../models');
var User = models('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demo App', selectedMenu:'' });
});


/* GET home page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact',success:req.flash('success'),selectedMenu:'contact'});
});

/* GET home page. */
router.post('/contact', function(req, res, next) {
  	var name = req.body.contactData.name;
  	var email = req.body.contactData.email;
    var comment = req.body.contactData.comment;
        var newContact = new Contact({
            name: name,
            email: email,
            comment: comment
        });
        /* Save contact here */
        Contact.createContact(newContact, function(err, Contact) {
            if (err)
                throw err;
           // req.flash('success', 'Your reqest has been successfully submitted.');
           // res.redirect('/contact');
           var response = {
            status:'true',
        }
        res.send(response);
        });

         var server  = emailServer.server.connect({
        user:    "vishal.chaturvedi@systematixindia.com", 
        password:"cntsklapgxovkika", 
        host:    "smtp.gmail.com", 
        ssl:     true
    });

    // send the message and get a callback with an error or details of the message that was sent
    server.send({
        text:    "Name:-"+name+" Email:- "+ email+" Comment:- "+ comment, 
        from:    "Demo App <vishal.chaturvedi@systematixindia.com>", 
        to:      "Vishal <vishal.chaturvedi@systematixindia.com>",
        cc:       name+" <"+email+">",
        subject: "Contact Us",
        attachment: 
        [
            {data:"<html><p><b>Name:- </b>"+name+"</p><p><b>Email:- </b>"+email+"</p><p><b>Comment:- </b>"+comment+"</p></html>", alternative:true},
           
        ]
    }, function(err, message) { /* console.log(err || message); */ });
});

/* logout function */
router.get('/logout', function(req, res) {
    var id = req.user.id;
    var name = req.user.name;
    req.logout();
    User.updateUser(id,{loginStatus:0}, function(err, User) {
            
    }); 
    req.app.io.emit('notification', {
            message: 'Left user',
            name: name
    });
    req.flash('success', 'You are now logged out');
    res.redirect('/');
});

module.exports = router;
