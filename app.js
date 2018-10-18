// var express = require('express');
// var path = require('path');
 // var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
 // var exphbs = require('express-handlebars');
 // var expressValidator = require('express-validator');
 // var flash = require('connect-flash');
 // var session = require('express-session');
 // var passport = require('passport');
 // var LocalStrategy = require('passport-local').Strategy;
 // var mongo = require('mongodb');
 // var mongoose = require('mongoose');

 // mongoose.connect('mongodb://localhost/loginapp');
// var db = mongoose.connection;

// var routes = require('./routes/index');
// var users = require('./routes/users');

// // Init App
// var app = express();

// // View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', exphbs({defaultLayout:'layout'}));
// app.set('view engine', 'handlebars');

// // BodyParser Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// // Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Express Session
// app.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));

// // Passport init
// app.use(passport.initialize());
// app.use(passport.session());

// // Express Validator
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

// // Connect Flash
// app.use(flash());

// // Global Vars
// app.use(function (req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   res.locals.user = req.user || null;
//   next();
// });



// app.use('/', routes);
// app.use('/users', users);

// // Set Port
// app.set('port', (process.env.PORT || 3000));

// app.listen(app.get('port'), function(){
// 
	// console.log('Server started on port '+app.get('port'));
// });




var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp',['user']);

var app = express();

//set view engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middle 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//global vars
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
})

//Express Validator midller
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req, res){
    db.user.find(function (err, docs) {
		res.render('index',{
  			title: 'Customers',
  			users:docs
  		});
	})

});

app.post('/users/add', function (req, res) {
	
	req.checkBody('first_name','first name is required').notEmpty;
	req.checkBody('last_name','last name is required').notEmpty;
	req.checkBody('email','email is required').notEmpty;

	var errors = req.validationErrors();

	if (errors) {
	  	res.render('index',{
  		title: 'Customers', 
  		users:users,
  		errors:errors
  });
	} else {
		var newUser = {
			first_name:req.body.first_name,
			last_name:req.body.last_name,
			email:req.body.email
		}

		db.user.insert(newUser, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/');
			}
		});

	}
});

app.listen(3000, function(){
  console.log('Server started on port 3000....')
});