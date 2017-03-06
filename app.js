/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('es6-promise').Promise;
var cors = require('cors');
var session = require("client-sessions");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var bids = require('./routes/bids');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var items = require('./routes/items');
var auctions = require('./routes/auctions');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
// app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(session({
    cookieName: 'session',
    secret: 'qwertyui12345678',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
app.use(cors());
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", 'Content-Type');
    next();
});


app.use('/', login);
app.use('/bids', bids);
app.use('/index', index);
app.use('/users', users);
app.use('/items', items);
app.use('/auctions', auctions);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
