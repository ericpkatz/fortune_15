var db = require('../../db');
var seeder = require('../../db/seeder');//we need this to seed data
var expect = require('chai').expect;
var request = require('supertest-as-promised')(require('../../app'));

describe('api', function(){
  before(function(done){
    db.connect('test', function(){
      console.log('DB is connected');
      done();
    });
  });
  beforeEach(function(done){
    var data = seeder.generateFixedData();
    db.seed(data, function(){
      console.log('DB is seeded');
      done();
    });
  });


  describe('GET /companies', function(){
   it('there are 2 companies', function(){
      return request.get('/companies')//supertest - make a request
        .expect(200)//expect a 200
        .then(function(resp){//get results
          expect(resp.body.length).to.eq(2);
          expect(resp.body[0].name).to.eq('Acme Tool and Die');
          expect(resp.body[1].name).to.eq('Full Stack Academy');
        });
    });
  });

  describe('GET /companies/1', function(){
   it('gets the first company', function(){
      return request.get('/companies/1')
        .expect(200)
        .then(function(resp){
          expect(resp.body.name).to.eq('Acme Tool and Die');
        });
    });
  });

  describe('GET /companies/1/employees', function(){
   it('gets the employees of Acme Tool and Die as well as the company', function(){
      return request.get('/companies/1/employees')
        .expect(200)
        .then(function(resp){
          expect(resp.body.employees.length).to.eq(2);
          expect(resp.body.employees[0].firstName).to.eq('Foo');
          expect(resp.body.employees[0].lastName).to.eq('Bar');
          expect(resp.body.company.name).to.eq('Acme Tool and Die');
        });
    });
  });

  describe('POST /companies/1/employees', function(){
   it('inserts a new employee', function(){
     var emp = {
       first_name: 'Tom',
       last_name: 'Sawyer',
       company_id: 2
     };
      return request.post('/companies/1/employees')//supertest post
        .send(`first_name=${emp.first_name}&last_name=${emp.last_name}&company_id=${emp.company_id}`)
        .expect(302)//we want to do a post to a redirect -- that's a 302
        .then(function(resp){
          //this is where I expect to go
          expect(resp.headers.location).to.eq('/companies/2/employees');
        
        });
    });
  });

  describe('GET /companies/1/employees/1', function(){
   it('return foo bar', function(){
      return request.get('/companies/1/employees/1')
        .expect(200)
        .then(function(resp){
          expect(resp.body.firstName).to.eq('Foo');
          expect(resp.body.lastName).to.eq('Bar');
        });
    });
  });

});
