var config                  = require('../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../utils/utils'),
    path                    = require('path'),
    async                   = require("async"),
    fs                      = require('fs'),
    moment                  = require('moment'),
    emailHelper             = require('sendgrid').mail,
    ObjectId                = require('mongodb').ObjectID,
    _                       = require('underscore'),

    Landing                 = require('../models/Landing'),
    Home                    = require('../models/Home'),
    Covers                  = require('../models/Covers'),
    Team                    = require('../models/Team'),
    Portfolio               = require('../models/Portfolio'),
    Tags                    = require('../models/Tags'),
    Offices                 = require('../models/Offices'),
    Services                = require('../models/Services'),
    Headers                 = require('../models/Headers'),
    Footers                 = require('../models/Footers'),
    PRT_row                 = require('../models/Portfolio_row'),
    Recent                  = require('../models/Recent_works'),
    Translate               = require('../lang/Translate');



var SiteController                              =  function() {};

// home page
SiteController.prototype.aboutPage              =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $header,$home,$recent,$footer;
    async.series([
        function _Header(cb) {
            Headers
                .find({page : "home"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Home(cb) {
            Home
                .findOne({})
                .exec( function (err, _home) {
                    if(err){
                        $home = "";
                        cb();
                    } else {
                        if (_home == null) {
                            $home = "";
                            cb();
                        } else {
                            $home = _home;
                            cb();
                        }
                    }
                });
        },
        function _Recent(cb) {
            Recent
                .find({})
                .sort({"priority": 1})
                .populate("work")
                .exec( function (err, _recent) {
                    if (_recent == null) {
                        $recent = null;
                        cb();
                    } else {
                        $recent = _recent;
                        cb();
                    }
                });
        },
        function _Footer(cb) {
            Footers
                .findOne({ page : "home" })
                .exec( function (err, _footer) {
                    if (_footer == null) {
                        $footer = null;
                        cb();
                    } else {
                        $footer = _footer;
                        cb();
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            response.render( path.resolve('resources/views/pages/site/about.jade'), {
                title           : "DAVIDELUNA: about page",
                page            : "home",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                header          : $header,
                home            : $home,
                recent          : $recent,
                footer          : $footer
            });
            response.end();
        }
    });

};

SiteController.prototype.coversPage              =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $header,$home,$recent,$footer;
    async.series([
        function _Header(cb) {
            Headers
                .find({page : "covers"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Home(cb) {
            Covers
                .findOne({})
                .exec( function (err, _home) {
                    if(err){
                        $home = "";
                        cb();
                    } else {
                        if (_home == null) {
                            $home = "";
                            cb();
                        } else {
                            $home = _home;
                            cb();
                        }
                    }
                });
        },
        function _Recent(cb) {
            Recent
                .find({})
                .sort({"priority": 1})
                .populate("work")
                .exec( function (err, _recent) {
                    if (_recent == null) {
                        $recent = null;
                        cb();
                    } else {
                        $recent = _recent;
                        cb();
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            response.render( path.resolve('resources/views/pages/site/covers.jade'), {
                title           : "DAVIDELUNA: covers page",
                page            : "covers",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                header          : $header,
                covers            : $home,
                recent          : $recent,
                footer          : $footer
            });
            response.end();
        }
    });

};

SiteController.prototype.portfolioPage          =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var prtOption = {
        isPublished : true
    };
    if(request.query.tag && request.query.tag != 'all'){
        prtOption = {
            isPublished : true,
            tags : { $in: [request.query.tag] }
        }
    }

    var $header,$footer,$portfolio,$tags;

    async.series([
        function _Header(cb) {
            Headers
                .find({page : "portfolio"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Portfolio(cb) {
            Portfolio
                .find(prtOption)
                .sort({"priority": 1})
                .populate("tags")
                .exec( function (err, _portfolio) {
                    if(err){
                        $portfolio = [];
                        cb();
                    } else {
                        if (_portfolio == null) {
                            $portfolio = [];
                            cb();
                        } else {
                            $portfolio = _portfolio;
                            cb();
                        }
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {

            response.render( path.resolve('resources/views/pages/site/portfolio.jade'), {
                title           : "DAVIDELUNA: works page",
                page            : "portfolio",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                tag             : 'all',
                header          : $header,
                portfolio       : $portfolio,
                tags            : $tags,
                footer          : $footer
            });
            response.end();
        }
    });

};

SiteController.prototype.portfolioDetailPage    =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var prtOption = {
        isPublished : true
    };
    if(request.params.uniqueName && request.params.uniqueName.replace(/\ /g, "") != ''){
        prtOption = {
            isPublished : true,
            uniqueName : request.params.uniqueName.replace(/\ /g, "")
        }
    }

    var $footer,$portfolio;

    async.series([
        function _Portfolio(cb) {
            Portfolio
                .findOne(prtOption)
                .populate("tags")
                .populate({
                    path: 'content',
                    options: { sort: { 'priority': 1 } }
                })
                .exec( function (err, _portfolio) {
                    if(err){
                        $portfolio = [];
                        cb();
                    } else {
                        if (_portfolio == null) {
                            $portfolio = [];
                            cb();
                        } else {
                            $portfolio = _portfolio;
                            cb();
                        }
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            if($portfolio && $portfolio.length != 0){
                response.render( path.resolve('resources/views/pages/site/portfolioDetail.jade'), {
                    title           : "DAVIDELUNA: "+$portfolio.name[lang],
                    page            : "portfolio",
                    fixHeader       : true,
                    lang            : lang,
                    cCode           : cCode,
                    _tr             : _tr,
                    portfolio       : $portfolio,
                    footer          : $footer
                });
                response.end();
            } else {
                response.render( path.resolve('resources/views/errors/404.jade'), {
                    title           : "DAVIDELUNA: PAGE NOT FOUND"
                });
                response.end();
            }
        }
    });

};

SiteController.prototype.servicesPage           =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $header,$footer,$services;

    async.series([
        function _Header(cb) {
            Headers
                .find({page : "successes"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Services(cb) {
            Services
                .findOne({})
                .exec( function (err, _services) {
                    if(err){
                        $services = "";
                        cb();
                    } else {
                        if (_services == null) {
                            $services = "";
                            cb();
                        } else {
                            $services = _services;
                            cb();
                        }
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            response.render( path.resolve('resources/views/pages/site/services.jade'), {
                title           : "DAVIDELUNA: services page",
                page            : "services",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                header          : $header,
                services        : $services,
                footer          : $footer
            });
            response.end();
        }
    });

};

SiteController.prototype.officesPage            =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $header,$footer,$offices;

    async.series([
        function _Header(cb) {
            Headers
                .find({page : "offices"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Offices(cb) {
            Offices
                .find({})
                .sort({"priority": 1})
                .exec( function (err, _offices) {
                    if(err){
                        $offices = [];
                        cb();
                    } else {
                        if (_offices == null) {
                            $offices = [];
                            cb();
                        } else {
                            $offices = _offices;
                            cb();
                        }
                    }
                });
        },
        function _Footer(cb) {
            Footers
                .findOne({ page : "offices" })
                .exec( function (err, _footer) {
                    if(err){
                        $footer = null;
                        cb();
                    } else {
                        if (_footer == null) {
                            $footer = null;
                            cb();
                        } else {
                            $footer = _footer;
                            cb();
                        }
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            response.render( path.resolve('resources/views/pages/site/offices.jade'), {
                title           : "DAVIDELUNA: offices page",
                page            : "offices",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                header          : $header,
                offices         : $offices,
                footer          : $footer
            });
            response.end();
        }
    });

};

SiteController.prototype.officeDetailPage       =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $recent,$office,$footer;

    async.series([
        function _Office(cb) {
            Offices
                .findOne({ uniqueName : "contacts" })
                .sort({"priority": 1})
                .exec( function (err, _office) {
                    if(err){
                        $office = [];
                        cb();
                    } else {
                        if (_office == null) {
                            $office = [];
                            cb();
                        } else {
                            $office = _office;
                            cb();
                        }
                    }
                });
        },
        function _Recent(cb) {
            Recent
                .find({})
                .sort({"priority": 1})
                .populate("work")
                .exec( function (err, _recent) {
                    if (_recent == null) {
                        $recent = null;
                        cb();
                    } else {
                        $recent = _recent;
                        cb();
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            if($office){
     
                response.render( path.resolve('resources/views/pages/site/office_detail.jade'), {
                    title           : "DAVIDELUNA: contacts page",
                    page            : "contacts",
                    lang            : lang,
                    cCode           : cCode,
                    _tr             : _tr,
                    fixHeader       : true,
                    recent          : $recent,
                    office          : $office,
                    footer          : $footer
                });
                response.end();
            } else {
                // TODO: 404
                console.log(404);
            }
        }
    });

};

SiteController.prototype.officeSendEmail        =  function (request, response) {

    var email                   = request.body.email  || " ";
    var name                    = request.body.full_name  || " ";
    var text                    = request.body.text  || " ";
    var _error_                 = false;
    function validatorEmail(value) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    if(validatorEmail(email)){
        _error_ = false;

    } else {
        _error_ = "Is not valid email address.";
    }

    if(_error_) {
        ResponseUtils.badRequest(response, _error_);
    } else {

        ResponseUtils.send(response, { status: 'success' });

        //sending process
        response.render(path.resolve(global.ROOT_DIR + 'resources/views/email_templates/officeEmail.jade'), {
            _email_           : email,
            _text_            : text,
            _name_            : name,
        }, function(err, html){

            var from_email  = new emailHelper.Email(config.office_fromEmail);
            var to_email    = new emailHelper.Email(config.office_toEmail);
            var subject     = "OFFICE HELP EMAIL"+moment().format("DD-MM-YYYY HH:mm:ss");
            var content     = new emailHelper.Content('text/html', html);
            var mail    = new emailHelper.Mail(from_email, subject, to_email, content);
            var sg      = require('sendgrid')(config.SENDGRID_API_KEY);

            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });

            sg.API(request, function(error, responseEmail) {
                if(error){
                    console.log("error", error);
                } else {
                    console.log("send email ------")
                }

            });
        });

        //sending process end
    }

};

SiteController.prototype.teamPage               =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    var $header,$footer,$team;

    async.series([
        function _Header(cb) {
            Headers
                .find({page : "team"})
                .sort({"priority": 1})
                .exec( function (err, _header) {
                    if(err){
                        $header = null;
                        cb();
                    } else {
                        if (_header == null) {
                            $header = null;
                            cb();
                        } else {
                            $header = _header;
                            cb();
                        }
                    }
                });
        },
        function _Team(cb) {
            Team
                .find({})
                .sort({"priority": 1})
                .exec( function (err, _team) {
                    if(err){
                        $team = [];
                        cb();
                    } else {
                        if (_team == null) {
                            $team = [];
                            cb();
                        } else {
                            $team = _team;
                            cb();
                        }
                    }
                });
        },
        function _Footer(cb) {
            Footers
                .findOne({ page : "team" })
                .exec( function (err, _footer) {
                    if(err){
                        $footer = null;
                        cb();
                    } else {
                        if (_footer == null) {
                            $footer = null;
                            cb();
                        } else {
                            $footer = _footer;
                            cb();
                        }
                    }
                });
        }
    ], function resolve (err) {
        if(err){
            response.redirect('/503');
            response.end();
        } else {
            response.render( path.resolve('resources/views/pages/site/team.jade'), {
                title           : "DAVIDELUNA: team page",
                page            : "team",
                lang            : lang,
                cCode           : cCode,
                _tr             : _tr,
                header          : $header,
                team            : $team,
                footer          : $footer
            });
            response.end();
        }
    });

};





// 404 page
SiteController.prototype.pageNotFound   =  function (request, response) {

    var lang    = "en";
    var cCode   = request["cCode"];
    if(request.query.lang){
        if(request.query.lang == "ru") lang = "ru"
    } else if(request["cCode"] && request["cCode"] == "RU"){
        lang = "ru"
    }

    var _tr  = Translate[lang];

    response.render( path.resolve('resources/views/errors/404.jade'), {
        title           : "DAVIDELUNA: PAGE NOT FOUND",
        page            : "",
        lang            : lang,
        cCode           : cCode,
        _tr             : _tr,
    });
    response.end();

};

// show image
SiteController.prototype.imageShow      = function (request, response) {
    var gfs = GRIDFS(CONNECTION.db);
    gfs.exist( { _id: request.params.id }, function (err, found) {
        if (err || !found) {
            ResponseUtils.notFound(response);
        } else {
            var readStream = gfs.createReadStream({ _id: request.params.id });
            readStream.pipe(response);
        }
    });
};

module.exports                          = new SiteController();