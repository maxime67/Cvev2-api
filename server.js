// Charger les variables d'environnement en premier
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cveRouter = require('./routes/cveRouter');
var productRouter = require('./routes/productRouter');
var vendorRouter = require('./routes/vendorRouter');
var authRouter = require('./routes/authRouter');
var connectDB = require('./config/database');
var cors = require('cors')

// Vérifier si la clé secrète JWT est définie
if (!process.env.JWT_SECRET) {
  console.error('ERREUR: La variable d\'environnement JWT_SECRET n\'est pas définie');
  console.error('Veuillez ajouter JWT_SECRET=votre_secret_jwt dans votre fichier .env');
  process.exit(1);
}

// Connect to the database
console.log('MongoDB URI:', process.env.MONGODB_URI);
connectDB();

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRouter);
app.use("/api/product", productRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/cve", cveRouter);

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

module.exports = app;