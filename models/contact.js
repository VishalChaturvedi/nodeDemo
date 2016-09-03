var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
    name:String,
    email:String,
    comment:String
	});
	

/* Contact model schema object */
var Contact = module.exports = mongoose.model('contact', contactSchema);


/* Get contact by id */
module.exports.getContactById = function(id, callback) {
    Contact.findById(id, callback);
}

/* A function get all contact list */
module.exports.getContacts = function(query, callback) {
    Contact.find(query, callback);
}

/* Update contact by id */
module.exports.updateContact = function(id, data, callback) {
    var query = {"_id": id};
    Contact.findOneAndUpdate(query, data, {upsert: true}, callback);
}

// Delete contact
module.exports.deleteContact = function(id, callback) {
    var query = {"_id": id};
    Contact.remove(query, callback);
}

/* Create a contact task */
module.exports.createContact = function(newContact, callback) {
    newContact.save(callback);
}


