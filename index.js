let express = require('express');

//create connection as shown in lecture video
let mysql = require('./dbcon.js');

let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');
let session = require('express-session');

app.use(session({secret:'1a2b3c'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(express.static('public'));

//renders home page
// app.get('/',function(req,res,next){
//   let context = {};
//   mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
//     let createString = "CREATE TABLE todo(" +
//     "id INT PRIMARY KEY AUTO_INCREMENT," +
//     "name VARCHAR(255) NOT NULL," +
//     "done BOOLEAN," +
//     "due DATE)";
//     mysql.pool.query(createString, function(err){
//       context.results = "Table reset";
//       res.render('home',context);
//     })
//   });
// });
//
// app.get('/insert',function(req,res,next){
//   var context = {};
//   mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function(err, result){
//     if(err){
//       next(err);
//       return;
//     }
//     context.results = "Inserted id " + result.insertId;
//     res.render('home',context);
//   });
// });

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
