//faker allows me to generate random names..
//and company names.. and just about anything else.
var faker = require('faker');
module.exports = {
  generateData : function(companyCount, employeeCount){
    var companies = [];
    var employees = [];
    while(companies.length < companyCount)
      companies.push({ name: faker.company.companyName(), id: companies.length + 1 });

    while(employees.length < employeeCount)
      employees.push({ first_name: faker.name.firstName(), last_name: faker.name.firstName(), id: employees.length + 1, company_id: Math.ceil(Math.random() * companyCount) });
    
    return { companies: companies, employees: employees };
  },

  generateFixedData : function(){
    //very simple set of data
    var companies = [
      { name: 'Acme Tool and Die'}, 
      { name: 'Full Stack Academy'}
    ];
    var employees = [
      { first_name: 'Foo', last_name: 'Bar', company_id: 1},
      { first_name: 'Fizz', last_name: 'Buzz', company_id: 1},
      { first_name: 'Nimit', last_name: 'Maru', company_id: 2},
      { first_name: 'David', last_name: 'Yang', company_id: 2},
      { first_name: 'The', last_name: 'Professor', company_id: 2}
    ];
    return { companies: companies, employees: employees };
  }
};
