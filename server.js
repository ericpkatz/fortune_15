var db = require('./db');
var http = require('http');
db.connect(function(){
  http.createServer(require('./app'))
    .listen(process.env.PORT);
});
