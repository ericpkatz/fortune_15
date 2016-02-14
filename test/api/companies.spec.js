var db = require('../../db');
var seeder = require('../../db/seeder');
var expect = require('chai').expect;
var request = require('supertest-as-promised')(require('../../app'));

describe('api', function(){
  before(function(done){
    db.connect('test', function(){
      console.log('DB is connected');
      done();
    });
  });
  before(function(done){
    var data = seeder.generateFixedData();
    db.seed(data, function(){
      console.log('DB is seeded');
      done();
    });
  });


  describe('/companies', function(){
   it('there are 2', function(){
      return request.get('/companies')
        .expect(200)
        .then(function(resp){
          expect(resp.body.length).to.eq(2);
        });
    });
  });

  describe('/companies/1/employees', function(){
   it('there is at least one employee', function(){
      return request.get('/companies/1/employees')
        .expect(200)
        .then(function(resp){
          expect(resp.body.length).to.eq(2);
        });
    });
  });

  describe('/companies/1/employees/1', function(){
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
