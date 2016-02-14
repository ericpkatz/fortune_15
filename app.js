var express = require('express');
var db = require('./db');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true }));

app.get('/companies', function(req, res, next){
  db.getCompanies(function(err, companies){
    res.json(companies);
  });
});

app.get('/companies/:id', function(req, res, next){
  db.getCompany(req.params.id, function(err, company){
    res.json(company);
  });
});

app.get('/companies/:id/employees', function(req, res, next){
  db.getEmployeesByCompanyId(req.params.id, function(err, employees){
    res.json(employees);
  });
});

app.post('/companies/:id/employees', function(req, res, next){
  db.insertEmployee(req.body.first_name, req.body.last_name, req.body.company_id, function(){
    res.redirect(`/companies/${req.body.company_id}/employees`);
  
  });
});

app.get('/companies/:companyId/employees/:id', function(req, res, next){
  db.getEmployee(req.params.companyId, req.params.id, function(err, employees){
    res.json(employees);
  });
});

module.exports = app;

