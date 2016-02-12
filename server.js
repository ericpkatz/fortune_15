var db = require('./db');
var http = require('http');
db.connect(function(){
  if(process.env.SEED)
    db.seed(15, 100, function(){
      createServer();
    });
  else
    createServer();
});

function createServer(){
  http.createServer(require('./app'))
    .listen(process.env.PORT);
}
