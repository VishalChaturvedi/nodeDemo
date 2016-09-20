var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models('users');
/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
   var id = req.user.id;
   var userRole = req.flash('userRole');
   console.log(userRole);
   User.getUserById(id, function(err, user) {
        res.render('admin', {title: 'Edit Profile',userRole:userRole,selectedMenu:'users', userDetails: user, errors: []});
    });
});

/* Get User list  */
router.post('/userList', ensureAuthenticated, function(req, res, next) {
    User.getUsers({}, function(err, users) {
        var response = {
            status:'true',
            data:users
        }
        res.send(response);
    });
});

/* Get User list  */
router.post('/loggedInUserList', ensureAuthenticated, function(req, res, next) {
    User.getLoggedInUser(function(err, users) {
        var response = {
            status:'true',
            data:users
        }
        res.send(response);
    });
});

/* GET user  details. */
router.post('/userDetails',ensureAuthenticated, function(req, res, next) {
   if(typeof req.body.id === 'undefined'){
  // if(req.body.id == ''){ 
    var id = req.user.id;
   }else{
    var id = req.body.id;
   }
    User.getUserById(id, function(err, user) {
        var response = {
            status:'true',
            data:user
        }
        res.send(response);
    });
});

/* set user profile details. */
router.post('/updateUserProfile',ensureAuthenticated, function(req, res, next) {
   var id = req.user.id;
   var data = req.body.userData;
   User.getUserById(id, function(err, user) {
        if(user.email == data.email){
            User.updateUser(id, data, function(err, User) {
            if (err){
                    throw err;
            }
            else{
                var response = {
                    status:'true'
                }
                res.send(response);    
            }
        });
        }else{
            User.getUserByEmail(data.email, function(err, user) {
                if (err){
                    throw err;
                    var response = {
                        status:'false',
                        message:'Technical error! Please try again later.'
                    }
                    res.send(response);
                }else{
                if(user == null){
                    User.updateUser(id, data, function(err, User) {
                        if (err){
                            throw err;
                        }
                        else{
                            var response = {
                                status:'true'
                            }
                        res.send(response);    
                        }
                    }); 
                }else{
                    var response = {
                        status:'false',
                        message:'Provided mail id already use by someone else'
                    }
                    res.send(response);
                }
                }
            });   
        }
    });   
});

/* set user profile details. */
router.post('/updateUserDetails',ensureAuthenticated, function(req, res, next) {
    var id = req.body.userData._id;
    var data = req.body.userData;
    User.getUserById(id, function(err, user) {
        if(user.email == data.email){
            User.updateUser(id, data, function(err, User) {
            if (err){
                    throw err;
            }
            else{
                var response = {
                    status:'true'
                }
                res.send(response);    
            }
        });
        }else{
            User.getUserByEmail(data.email, function(err, user) {
                if (err){
                    throw err;
                    var response = {
                        status:'false',
                        message:'Technical error! Please try again later.'
                    }
                    res.send(response);
                }else{
                if(user == null){
                    User.updateUser(id, data, function(err, User) {
                        if (err){
                            throw err;
                        }
                        else{
                            var response = {
                                status:'true'
                            }
                        res.send(response);    
                        }
                    }); 
                }else{
                    var response = {
                        status:'false',
                        message:'Provided mail id already use by someone else'
                    }
                    res.send(response);
                }
                }
            });   
        }
    }); 
});

/* remove user hard delete */
router.post('/userDelete',ensureAuthenticated, function(req, res, next) {
    var id = req.body.userID;
    User.deleteUser(id, function(err, success) {
        if (err){
                throw err;
                var response = {
                    status:'false',
                    message:'There are some error. Please try again'
            }
            res.send(response);
        }
        else{
            var response = {
                    status:'true'
            }
            res.send(response);    
        }
    })
});
/* Update profile  */
router.post('/admin', ensureAuthenticated, function(req, res, next) {
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
            res.render('admin', {title: 'Edit Profile',selectedMenu:'users', taskDetails: taskDetails, errors: errors});
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
            res.redirect('admin');
        });
    }
});


/* For check Authentication */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    }
    res.redirect('/');
}

module.exports = router;
