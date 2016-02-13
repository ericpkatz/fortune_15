var db = require('./db');

var http = require('http');
db.connect('f500', function(){
  if(process.env.SEED){
    var data = require('./db/seeder').generateData(150, 1000)
    db.seed(data, function(){
      createServer();
    });
  }
  else
    createServer();
});

function createServer(){
  var port = process.env.PORT || 3000;
  http.createServer(require('./app'))
    .listen(port, function(){
      console.log('server started ' + port);
    });
}
