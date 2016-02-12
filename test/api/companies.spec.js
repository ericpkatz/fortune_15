var db = require('../../db');
var expect = require('chai').expect;
var request = require('supertest-as-promised')(require('../../app'));
describe('api', function(){
  before(function(done){
    db.connect(function(){
      console.log('DB is connected');
      done();
    });
  });
  before(function(done){
    db.seed(15, 100, function(){
      console.log('DB is seeded');
      done();
    });
  });


  describe('/companies', function(){
   it('there are 15', function(){
      return request.get('/companies')
        .expect(200)
        .then(function(resp){
          companies = resp.body;
          expect(resp.body.length).to.eq(15);
        });
    });
  });

  describe('/companies/1/employees', function(){
   it('there is at least one employee', function(){
      return request.get('/companies/1/employees')
        .expect(200)
        .then(function(resp){
          expect(resp.body.length).to.be.gt(0);
        });
    });
  });

  describe('/employees', function(){
   it('there are 100', function(){
      return request.get('/employees')
        .expect(200)
        .then(function(resp){
          expect(resp.body.length).to.eq(100);
        });
    });
  });
});
