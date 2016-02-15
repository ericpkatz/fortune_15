var sqlite = require('sqlite3');
var chalk = require('chalk');
var _db;
module.exports = {
  connect : function(dbName, cb){
    if(_db)//if we have connected, then return connection
      return cb(null, _db);
    //connect to database - pass in database name. (this is for testing)
    new sqlite.Database(__dirname +'/' + dbName +'.db', function(err){
      if(err)
        return cb(err, null);
      console.log(this);
      _db = this;//set _db to my connection
      //do some profiling
      _db.on('profile', function(qry, time){
        console.log(chalk.blue(qry));
        console.log(chalk.magenta(time/1000 + ' seconds'));
      });
      cb(null, _db);//pass back database connection
    });
  },
  seed : function(data, cb){
    //a utility function to make sure my sql statement don't get messed up with a name like O'Brian
    function clean(input){
      return input.replace('\'', '');
    
    }
    //data has companies.. and employees
    var companiesQuery = data.companies.map(function(company){
      //generate a sql statement for each company
      return `
        insert into companies (name) values ('${clean(company.name)}');
        `;
    }).join('');
    var employeesQuery = data.employees.map(function(employee){
      //generate a sql statement for each employee
      return `
        insert into employees (first_name, last_name, company_id) values ('${clean(employee.first_name)}','${clean(employee.last_name)}',${employee.company_id});
        `;
    }).join('');
    //scripts for creating tables
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

    console.log(script);
    //now I execute my script to seed my database.

    _db.exec(script, function(err){
      console.log('--DONE EXEC--');
      cb(err);
    });
  },
  getCompanies : function(cb){
    var qry = `
      select companies.id, name, count(*) as employeeCount
      from companies
      join employees
      ON companies.id = employees.company_id
      GROUP BY companies.id
      ;
      `;
    //get all the companies.. it's async so we need a callback
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
    //get all the the employees and callback
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
    //get employees for a particular company
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
        //so the data is stored in my database as first_name and last_name but
        //I want to 'transform' it to firstName and lastName
        //although this is annoying-- it is quite common
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
  getEmployee : function(companyId, id, cb){
    //get an individual employee
    //I really don't need the companyId-- but I am making the decision that
    //everything will flow through the company
    var qry = `
      select employees.id, first_name, last_name, company_id, companies.name 
      from employees 
      join companies 
      ON companies.id = employees.company_id
      WHERE employees.id = ? and companies.id = ? 
      ;
      `;
    _db.all(qry, [companyId, id], function(err, rows){
      var data;
      if(rows){
        row = rows[0];
          data =  {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            company : {
              id: row.company_id,
              name: row.name
            } 
          };
      }
      cb(err, data);
    }); 
  },
  getCompany : function(id, cb){
    //get a single company
    var qry = `
      select id, name 
      from companies 
      WHERE id = ? 
      ;
      `;
    _db.all(qry, [id], function(err, rows){
      console.log(arguments);
      var data;
      if(rows){
        data = rows[0];
      }
      cb(err, data);
    }); 
  },
  insertEmployee : function(firstName, lastName, companyId, cb){
    //this query inserts into the database
    var qry = `
      INSERT into employees (first_name, last_name, company_id)
      VALUES (?, ?, ?)
      ;
      `;
    _db.run(qry, [firstName, lastName, companyId], function(err){
      cb(err);
    }); 
  },
};
