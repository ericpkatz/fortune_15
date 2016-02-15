var app = require('express').Router();
var db = require('../db');

app.get('/', function(req, res, next){
  db.getCompanies(function(err, companies){
    res.render('companies/list', { title: 'Companies', section: 'companies', companies: companies})
  });
});

app.get('/:id', function(req, res, next){
  //gets a company from the db
  db.getCompany(req.params.id, function(err, company){
    res.json(company);
  });
});

//this is known as a nested route- employees are nested under companies.
app.get('/:id/employees', function(req, res, next){
  //gets employees at a company
  //these nested callbacks are BAD.. not GOOD BAD.. .BAD BAD
  //but we can't do much yet-- we need to learn about promises first..
  db.getEmployeesByCompanyId(req.params.id, function(err, employees){
    //get's the company itself
    db.getCompany(req.params.id, function(err, company){
      var backLink = {
        text: 'Back to Companies',
        url: '/companies'
      };
      res.render('employees/list', { title: company.name, section: 'companies', employees: employees, backLink: backLink, company: company });
    });
  });
});

app.post('/:id/employees', function(req, res, next){
  //inserts an employee for a company
  db.insertEmployee(req.body.first_name, req.body.last_name, req.body.company_id, function(){
    res.redirect(`/companies/${req.body.company_id}/employees`);
  
  });
});

app.get('/:id/employees/new', function(req, res, next){
    db.getCompanies(function(err, companies){
      var company = companies.filter(function(c){
        return c.id === req.params.id*1;
      })[0];
      var backLink = {
        text: `Back to ${company.name}`,
        url: `/companies/${company.id}/employees`
      };
      res.render('employees/new', { companies: companies, company: company, title: 'Add Employee', section: 'companies', backLink: backLink});
    });   
  
  
});

app.get('/:companyId/employees/:id', function(req, res, next){
  //gets information about an employee
  db.getEmployee(req.params.companyId, req.params.id, function(err, employees){
    res.json(employees);
  });
});

module.exports = app;
