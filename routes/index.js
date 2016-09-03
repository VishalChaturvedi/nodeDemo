var express = require('express');
var router = express.Router();
var Contact = require('../models/contact');


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
  	var name = req.body.name;
  	var email = req.body.email;
    var comment = req.body.comment;
    // Form Validator
   // req.checkBody('name', 'Name field is required').notEmpty();
   // req.checkBody('comment', 'Comments field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('contact', {title: 'Comment', errors: errors,selectedMenu:'contact'});
        console.log(errors);
    } else {
        var newContact = new Contact({
            name: name,
            email: email,
            comment: comment
        });
        /* Save contact here */
        Contact.createContact(newContact, function(err, Contact) {
            if (err)
                throw err;
            req.flash('success', 'Your reqest has been successfully submitted.');
            res.redirect('/contact');
        });

    }

});

/* logout function */
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/login');
});

module.exports = router;
