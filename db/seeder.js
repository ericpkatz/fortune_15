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
  }
};
