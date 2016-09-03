var mongoose = require('mongoose');

mongoose.connect('mongodb://demoapp:123456@ds019254.mlab.com:19254/nodeapp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //console.log("finaly we're connected!");
});
