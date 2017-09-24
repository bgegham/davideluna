/**
 * <davideluna> created by Gegham Barseghyan | phone: +(374)99999881.
 */

var express             = require('express'),
    session             = require('express-session'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose	        = require('mongoose'),
    multer              = require('multer'),
    methodOverride      = require('method-override'),
    morgan              = require('morgan'),
    cors                = require('cors'),
    gridFs              = require('gridfs-stream'),
    moment              = require('moment'),
    cookieParser        = require('cookie-parser'),
    expressValidator    = require('express-validator'),
    fs                  = require('fs'),
    path                = require('path'),
    async               = require("async");

app.locals.moment       = moment;

// set session
app.use(session({
    secret: 'secret_maeutica_ecretdjkfalfkssvsskjlgajf87kn677867kdfgssdjfn88867akddf867nssdkjfbadjkfbadfdks7kvkjf867da8jdfbnkjdfbndf',
    cookie: { maxAge: 1800000*18 },
    resave: true,
    saveUninitialized: true
}));

// config file with environment
var APP_ENV             = process.env.APP_ENV || 'development';
global.APP_ENV          = APP_ENV;


var config              = require('./config')[APP_ENV];

// mongodb settings
global.ROOT_DIR         = __dirname + '/';
global.CONNECTION       = mongoose.connection;
global.GRIDFS           = gridFs;
gridFs.mongo            = mongoose.mongo;

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/*+json' }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(cookieParser());

// connect to our mongo DB database
mongoose.connect(config.mongo_url);

// set cors security
app.use(cors());

// use validator package
app.use(expressValidator());

// set the static files location
var cacheTime = 86400000*7;     // 7 days
app.use(express.static(__dirname + '/public',{ maxAge: cacheTime }));

// site view engine JADE
app.set('views', '/resources/views');
app.set('view engine', 'jade');
app.use(methodOverride('X-HTTP-Method-Override'));

if (APP_ENV === 'development') {
    app.use(morgan('dev'));
}

// first start
require('./app/migrations/appFirstStart');

// routes for site pages
require('./app/routes/site_routes')(app, multer({ dest: 'tmp/site/' }));

// routes for admin
require('./app/routes/cpanel_routes')(app, multer({ dest: 'tmp/cpanel/' }));

// routes for api
require('./app/routes/api_routes')(app, multer({ dest: 'tmp/api/' }));

// route to handle all angular requests
app.get('*', function(req, res) {
    var Translate = require('./app/lang/Translate');
    var lang    = "en";
    var cCode   = req["cCode"];
    if(req.query.lang){
        if(req.query.lang == "ru") lang = "ru"
    } else if(req["cCode"] && req["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    res.render( path.resolve('resources/views/errors/404.jade'), {
        title           : "DAVIDELUNA: PAGE NOT FOUND",
        page            : "",
        lang            : lang,
        cCode           : cCode,
        _tr             : _tr,
    });
    res.end();
});

// Handle 500
app.use(function(error, req, res, next) {

    var Translate = require('./app/lang/Translate');
    var lang    = "en";
    var cCode   = req["cCode"];
    if(req.query.lang){
        if(req.query.lang == "ru") lang = "ru"
    } else if(req["cCode"] && req["cCode"] == "RU"){
        lang = "ru"
    }
    var _tr  = Translate[lang];

    if(error.statusCode == 500){
        res.status(500);
        res.render( path.resolve('resources/views/errors/500.jade'), {
            title           : "DAVIDELUNA: Internal server error",
            page            : "",
            lang            : lang,
            cCode           : cCode,
            _tr             : _tr,
        });
    } else {
        console.log(error);
        res.status(400);
        res.render( path.resolve('resources/views/errors/400.jade'), {
            title           : "DAVIDELUNA: bad request",
            page            : "",
            lang            : lang,
            error           : error,
            cCode           : cCode,
            _tr             : _tr,
        });
    }
    res.end();
});

// startup our app
app.listen(config.http_port, config.http_host);

// shout out to the user
console.log(' ----------------------------------------------------------');
console.log('|                                                          |');
console.log('|          << DAVIDELUNA >> started on port ' + config.http_port + '           |');
console.log('|                                                          |');
console.log(' ----------------------------------------------------------');
console.log('');
console.log('');
console.log('');

// expose app
exports = module.exports = app;