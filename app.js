var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var expressValidator = require('express-validator');
var flash = require('express-flash');
var email = require('emailjs');
users = [];
connections = [];


var db = require('./db');
var models = require('./models');
var User = models('users');
var Chat = models('chat');

var routes = require('./routes/index');
var chat = require('./routes/chat');
var admin = require('./routes/admin');
var login = require('./routes/login');
var registration = require('./routes/registration');
var app = express();

/* Socket Connnection */
var http = require('http').Server(app);
http.listen(process.env.PORT || 3000);
var io = require('socket.io')(http);
app.io = io;
/* End socket connection */


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

io.on('connection', function(socket){
  connections.push(socket);
  var cookies = parseCookies(socket.client.request.headers.cookie);
  cookies = JSON.parse(decodeURIComponent(cookies.demoApp));
  socket.userid = cookies.id;
  socket.username = cookies.name;
  users.push(socket.userid);
  
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.userid),1);
    connections.splice(connections.indexOf(socket),1);
    if(users.indexOf(socket.userid) == "-1"){
      io.emit('notification', {
              message: 'Left user',
              name: socket.username
      }); 
      User.updateUser(socket.userid,{loginStatus:0}, function(err, User) {
              
      }); 
    }else{
      // Do nothing...
    }
  });

  socket.on('typing', function(data) {
    io.emit('typing', data);
  });

  socket.on('send-message', function(data) {
    var newChat = new Chat({
      senderId: data.senderId,
      senderName: data.senderName,
      message: data.message 
    });
    Chat.saveChat(newChat, function(err, chat) {
      if (err)
        throw err;
    }); 
    Chat.getChat({}, function(err, chats) {
    });
    io.emit('received-message', data);
  });
});



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));


/* Passport  Should be inject by session*/
app.use(passport.initialize());
app.use(passport.session());


/* heroku Host 
passport.use(new FacebookStrategy({
    clientID: '778533818956590',
    clientSecret: 'e29dcaf9644c8c1105155854914e7a8a',
    callbackURL: "https://sysdemoapp.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name','displayName'],
  }, */
  /* local host  */
  passport.use(new FacebookStrategy({
    clientID: '200684187016093',
    clientSecret: '7e3fa67cf9773fb3d20c13f4d72adea3',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name','displayName'],
  }, 

  function(accessToken, refreshToken, profile, cb) {
    var name  = profile.displayName;
    var email  = profile.emails[0].value;
    User.getUserByEmail(email, function (err, user) {
      if(user){
        return cb(null, user);
      }else{
        var newUser = new User({
          name : name,
          email: email,
        });
        User.createFbUser(newUser, function (err, user) {
          return cb(null, user);
        });
      }
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/admin');
  });

// Validator middleware 
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
/* Flash should be inject by session */
app.use(flash());


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Store the session user for every request */
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;

  next();
});

app.use('/', routes);
app.use('/chat', chat);
app.use('/login', login);
app.use('/registration', registration);
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function parseCookies (request) {
    var list = {},
        rc = request;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

module.exports = app;
