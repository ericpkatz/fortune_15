//we need our database
var db = require('./db');//same as require('./db/index')


var http = require('http');
//we connect to the 'f500' database
db.connect('f500', function(){
  //once connected to db.. create your server
  createServer();
});

function createServer(){
  var port = process.env.PORT || 3000;
  /* a server needs to know what responses to send to
     what requests - our express app knows how to 
     handle requests and responses -- so it will 
     handle that */
  http.createServer(require('./app'))
    .listen(port, function(){
      console.log('server started ' + port);
    });
}
