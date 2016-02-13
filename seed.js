var db = require('./db');
var seeder = require('./db/seeder');
var chalk = require('chalk');

db.connect('f500', function(){
  console.log(chalk.green('connected to DB'));
  var data = seeder.generateData(15, 100);
  db.seed(data, function(){
    console.log(chalk.green('seeding of database is complete'));
  });
});
