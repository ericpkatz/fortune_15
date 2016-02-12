var express = require('express');
var db = require('./db');

var app = express();

app.get('/companies', function(req, res, next){
  db.getCompanies(function(err, companies){
    res.json(companies);
  });
});

app.get('/companies/:id/employees', function(req, res, next){
  db.getEmployeesByCompanyId(req.params.id, function(err, employees){
    res.json(employees);
  });
});

app.get('/employees', function(req, res, next){
  db.getEmployees(function(err, employees){
    res.json(employees);
  });
});

module.exports = app;

