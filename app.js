var createError = require('http-errors');
var express = require('express');
var app = express();

// const http = require('http');
const cors = require('cors');
// const { Server } = require("socket.io");
app.use(cors());
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(express.json());


// const server = http.createServer(app); // Create an HTTP server and pass the Express app
// const io = new Server(server,{
//   cors:{
//     origin:"http://localhost:3001",
//     methods:["GET","POST"]
//   }
// }); 

// io.on("connection", (socket) => {
//   console.log(`user connected:${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  //   console.log("User Joined Room: " + data);
  // });

  // socket.on("send_message", (data) => {
  //   console.log(data);
  //   socket.to(data.room).emit("receive_message", data.content);
  // });

//   socket.on("disconnect", () => {
//     console.log("USER DISCONNECTED",socket.id);
//   });
// });








var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// const session = require("express-session")
// const passport = require("passport")
const UserModel = require("./models/userModel")
const EmployeeModel = require("./models/employeeModel");

const dotenv = require('dotenv')
dotenv.config();
require("./models/db")



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(
//   session({
//       saveUninitialized: false,
//       resave: false,
//       secret: "jkdso98ew",
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));


app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
