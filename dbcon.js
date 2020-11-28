var mysql = require('mysql');
var pool = mysql.createPool({
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_kramerp',
  password        : '5685',
  database        : 'cs290_kramerp'
});

module.exports.pool = pool;
