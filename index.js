let express = require('express');

//create connection as shown in lecture video
let mysql = require('./dbcon.js');

let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(express.static('public'));

//including this because it was on the assignment page, not sure if needed
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "unit VARCHAR(255) NOT NULL,"+
    "date DATE,"+
  "id INT PRIMARY KEY AUTO_INCREMENT)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

// <<<<<<THIS IS THE PRODUCTION GET>>>>>>>
app.get('/',function(req,res,next){
  let context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      return;
    }
    let workouts = rows;
    let workoutsJSON = JSON.stringify(workouts);
    context.workoutsJSON = workoutsJSON;
    context.workouts = workouts;
    res.render('home', context);
  });
});

app.get('/data',function(req,res,next){
  let context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      return;
    }
    let workouts = rows;
    let workoutsJSON = JSON.stringify(workouts);
    context.workoutsJSON = workoutsJSON;
    context.workouts = workouts;
    res.send(context);
  });
});

app.post('/', function(req,res,next){
  if(req.body.type == 'delete') {
    mysql.pool.query("DELETE FROM workouts WHERE name=(?)",[req.body.name],
    function(err, result){
      if(err){
        console.log('connection not made to DB');
        next(err);
        return;
        }
      res.render('home');
      });
  } else {
    mysql.pool.query("INSERT INTO workouts (name, reps, weight, unit, date) VALUES (?)",
  [[req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date]],
    function(err, result){
      if(err){
        console.log('connection not made to DB');
        next(err);
        return;
        }
      res.render('home');
      });
    }
  res.render('home');
});

app.post('/update',function(req,res,next){
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, unit=?, date=? WHERE name=? ",
  [req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date, req.body.originalName],
  function(err, result){
    if(err){
      console.log('connection not made to DB');
      next(err);
      return;
      }
    res.render('home');
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
