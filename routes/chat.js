var express = require('express');
var router = express.Router();
var models = require('../models');
var Chat = models('chat');

/* Get User list  */
router.post('/chatList', ensureAuthenticated, function(req, res, next) {
    Chat.getChat({}, function(err, chats) {
        var response = {
            status:'true',
            data:chats
        }
        res.send(response);
    });
});

/* For check Authentication */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    }
    res.redirect('/');
}
module.exports = router;
