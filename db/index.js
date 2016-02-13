var seeder = require('./seeder');
var sqlite = require('sqlite3');
var chalk = require('chalk');
var _db;
module.exports = {
  connect : function(dbName, cb){
    if(_db)
      return cb(null, _db);
    else
      new sqlite.Database(__dirname +'/' + dbName +'.db', function(err){
        if(err)
          return cb(err, null);
        console.log(this);
        _db = this;
        _db.on('profile', function(qry, time){
          console.log(chalk.blue(qry));
          console.log(chalk.magenta(time/1000 + ' seconds'));
        
        });
        cb(null, _db);
      });
  },
  seed : function(data, cb){
    var companiesQuery = data.companies.map(function(company){
      return `
        insert into companies (name) values ('${company.name}');
        `;
    }).join('');
    var employeesQuery = data.employees.map(function(employee){
      return `
        insert into employees (first_name, last_name, company_id) values ('${employee.first_name}','${employee.last_name}',${employee.company_id});
        `;
    }).join('');
    var script = `
      DROP TABLE if exists companies;
      CREATE TABLE companies (
          id INTEGER PRIMARY KEY,
          name string
       );
      DROP TABLE if exists employees;
      CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          last_name string,
          first_name string,
          company_id integer,
          FOREIGN KEY (company_id)
          REFERENCES companies(id)
       );
      ${companiesQuery}
      ${employeesQuery}
      `;

    _db.exec(script, function(err){
      cb(err);
    });
  },
  getCompanies : function(cb){
    var qry = `
      select name, count(*) as employeeCount
      from companies
      join employees
      ON companies.id = employees.company_id
      GROUP BY companies.id
      ;
      `;
    _db.all(qry, function(err, rows){
      cb(err, rows);
    }); 
  },
  getEmployees : function(cb){
    var qry = `
      select employees.id, first_name, last_name, company_id, companies.name 
      from employees 
      join companies 
      ON companies.id = employees.company_id
      ;
      `;
    _db.all(qry, function(err, rows){
      var data;
      if(rows){
        data = rows.map(function(row){
          return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            company : {
              id: row.company_id,
              name: row.name
            } 
          };
        });
      }
      cb(err, data);
    }); 
  },
  getEmployeesByCompanyId : function(id, cb){
    var qry = `
      select employees.id, first_name, last_name, company_id, companies.name 
      from employees 
      join companies 
      ON companies.id = employees.company_id
      WHERE company_id = ?
      ;
      `;
    _db.all(qry, [id], function(err, rows){
      var data;
      if(rows){
        data = rows.map(function(row){
          return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            company : {
              id: row.company_id,
              name: row.name
            } 
          };
        });
      }
      cb(err, data);
    }); 
  }
};
