var sqlite = require('sqlite3');
var _db;
module.exports = {
  connect : function(cb){
    if(_db)
      return cb(null, _db);
    else
      new sqlite.Database('f500.db', function(err){
        if(err)
          return cb(err, null);
        _db = this;
        cb(null, _db);
      });
  }

};
