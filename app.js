var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//change
var http = require('http');
var server = http.createServer(app);

app.use(session({
    secret: "LeeMall",
    resave: false,
    saveUninitialized: true,
    cookie: ('name', 'value',{maxAge:  5*60*1000,secure: false})
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/cart.html', function (req, res) {
    console.log(req.session.user_id);
    if (req.session.user_id) {
        res.sendFile(__dirname + '/static/cart.html');
    } else {
        res.sendFile(__dirname + '/static/login.html');
    }
});

app.get('/order.html', function (req, res) {
    console.log(req.session.user_id);
    if (req.session.user_id) {
        res.sendFile(__dirname + '/static/order.html');
    } else {
        res.sendFile(__dirname + '/static/login.html');
    }
});
app.use(express.static('static'));

app.use('/api', indexRouter);
app.use('/users', usersRouter);



app.get('/LeeMall',(req,res)=>{
  res.sendFile(`${__dirname}/static/index.html`);
})

app.listen('3000');