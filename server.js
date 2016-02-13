var db = require('./db');
var http = require('http');
db.connect('f500', function(){
  createServer();
});

function createServer(){
  var port = process.env.PORT || 3000;
  http.createServer(require('./app'))
    .listen(port, function(){
      console.log('server started ' + port);
    });
}
