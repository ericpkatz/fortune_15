var express = require('express');
var db = require('./db');
var bodyParser = require('body-parser');
var swig = require('swig');
var path = require('path');
swig.setDefaults({cache: false});

var app = express();
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true }));


app.get('/', function(req, res, next){
  res.render('index', { title: 'Welcome to Fortune 15', section: 'home'});
  
});
app.use('/companies', require('./routes/companies'));

module.exports = app;

