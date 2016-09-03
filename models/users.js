var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var usersSchema = mongoose.Schema({
    name:String,
    email:{
    type: String,
    unique: true,
    required: true
  },
    password:String,
    userRole:{ type: String, default: '1' },
    userStatus:{ type: String, default: '1' },
    createdDate:{ type: Date, default: Date.now }
	});
	
//module.exports = mongoose.model('users', usersSchema);

/* User model schema object */
var User = module.exports = mongoose.model('users', usersSchema);

	/* A function for get user by id */
module.exports.getUserById = function(id, callback){
	User.findById(id,'name email', callback);
}

/* A functiono for get user detials by email */
module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
	User.findOne(query, callback);
}

/* A function for compare password */
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

/* A function for save user */
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash;
   			newUser.save(callback);
    	});
	});
}

/* Update User by id */
module.exports.updateUser = function(id, data, callback) {
    var query = {"_id": id};
    if(!data.password){

        		User.findOneAndUpdate(query, data, {upsert: true}, callback);
            }
   	    else{
        	 bcrypt.genSalt(10, function(err, salt) {
    			bcrypt.hash(data.password, salt, function(err, hash) {
   				data.password = hash;
   				User.findOneAndUpdate(query, data, {upsert: true}, callback);
   			});
		});
	}
}

// Delete task
module.exports.deleteUser = function(id, callback) {
    var query = {"_id": id};
    User.remove(query, callback);
}


/* A function get all users list */
module.exports.getUsers = function(query, callback) {
    User.find(query, callback);
}

/* A function for save fb user */
module.exports.createFbUser = function(newUser, callback){
        newUser.save(callback);
}
