var mongoose = require('mongoose'),Schema = mongoose.Schema;
var models = require('../models');
var User = models('users');
var chatSchema = mongoose.Schema({
    senderId:{ type: Schema.ObjectId, ref: 'User' },
    reciverId:{ type: Schema.ObjectId, ref: 'User' },
    senderName:{ type: String },
    reciverName:{ type: String },
    message:String,
    type:{ type: String, default: '1' },
    sentStatus:{ type: String, default: '0' },
    createdDate:{ type: Date, default: Date.now }
	});



/* Chat model schema object */
var Chat = module.exports = mongoose.model('chats', chatSchema);

/* A function for save chat message */
module.exports.saveChat = function(newChat, callback){
	newChat.save(callback);
}

/* A function get all users list */

module.exports.getChat = function(query, callback) {
    Chat.find(query, callback);
}