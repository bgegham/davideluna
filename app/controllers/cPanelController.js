var config                  = require('../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../utils/utils'),
    md5                     = require('MD5'),
    path                    = require('path'),
    mongoose	            = require('mongoose'),
    idGenerator             = require('password-generator'),
    _                       = require('underscore'),

    Admin                   = require('../models/Admin'),
    Landing                 = require('../models/Landing'),
    Home                    = require('../models/Home'),
    Team                    = require('../models/Team'),
    Portfolio               = require('../models/Portfolio'),
    Tags                    = require('../models/Tags'),
    Offices                 = require('../models/Offices'),
    Services                = require('../models/Services'),
    Headers                 = require('../models/Headers'),
    Footers                 = require('../models/Footers'),
    PRT_row                 = require('../models/Portfolio_row'),
    Recent                  = require('../models/Recent_works'),
    MediaData               = require('../models/MediaData'),

    async                   = require("async"),
    fs                      = require('fs'),
    ObjectId                = require('mongodb').ObjectID;

var CPanelController    = function() {};

/**
 *
 * @CPanelController actions
 */

// authentication
CPanelController.prototype.get_login            = function (request, response) {
    response.render( path.resolve('resources/views/pages/cpanel/auth/login.jade'), {
        title       : "MAEUTICA: cpanel login page"
    });
    response.end();
};

CPanelController.prototype.CREATE_SESSION       = function (request, response) {

    var errorMessage    = 'Login failed, please try again.',
        username        = request.body.username,
        password        = request.body.password;

    Admin.findOne({ username: username }).exec( function (err, admin) {
        if (admin == null) {
            ResponseUtils.badRequest(response, errorMessage);
        } else {
            if (admin.password === md5(password)) {
                request.session.admin = admin;
                ResponseUtils.send(response, { url: '/control/admin/greeting' });
            } else {
                ResponseUtils.badRequest(response, errorMessage);
            }
        }
    });

};

CPanelController.prototype.DESTROY_SESSION      = function (request, response) {

    if(request.session.admin){
        request.session.destroy();
        ResponseUtils.send(response, { url: '/control/admin/oauth/login' });
    } else {
        ResponseUtils.send(response, { url: '/control/admin/oauth/login' });
    }

};

// greeting
CPanelController.prototype.get_greeting         = function (request, response) {

    if(request.session.admin){
        response.render( path.resolve('resources/views/pages/cpanel/greeting/view.jade'), {
            title               : "MAEUTICA: greeting page",
            active_menu         : "greeting"
        });
        response.end();
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// landing
CPanelController.prototype.get_landing          = function (request, response) {

    if(request.session.admin){
        var lang    = "en";
        if(request.query.lang && request.query.lang == "ru") lang = "ru";

        Landing
            .findOne({})
            .sort({"priority": 1})
            .exec(function (err, _landing) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/landing/ckView.jade'), {
                        title               : "MAEUTICA: landing page",
                        active_menu         : "landing",
                        lang                : lang,
                        landing             : _landing
                    });
                    response.end();
                }
            });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.saveLandingCK       = function (request, response) {

    if(request.session.admin){
        Landing
            .findOne( { _id: request.params.id } , function (err, _landing) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_landing) {
            _landing.content[request.params.lang] = request.body.content;
            _landing.save( function(err) {
                if (err) {
                    response.cookie('snm', "Landing not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/landing?lang='+request.params.lang);
                    response.end();
                } else {
                    response.cookie('snm', "Landing successfully updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/landing?lang='+request.params.lang);
                    response.end();
                }
            });
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// home
CPanelController.prototype.get_home             = function (request, response) {

    if(request.session.admin){
        var lang    = "en";
        if(request.query.lang && request.query.lang == "ru") lang = "ru";

        Home
            .findOne({})
            .sort({"priority": 1})
            .exec(function (err, _home) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/home/ckView.jade'), {
                        title               : "MAEUTICA: home page",
                        active_menu         : "home",
                        lang                : lang,
                        home                : _home
                    });
                    response.end();
                }
            });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_home_json        = function (request, response) {

    Home
        .findOne({})
        .exec( function (err, _home) {
        if (_home == null) {
            ResponseUtils.badRequest(response, err);
        } else {
            ResponseUtils.send(response, _home);
        }
    });

};

CPanelController.prototype.ADD_HOME_CONTENT     = function (request, response) {

    if(request.session.admin){
        Home
            .findOne({})
            .exec(function (err, _home) {
                if (_home == null) {
                    response.cookie('snm', "Home page not updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/home');
                    response.end();
                } else {
                    _home.content = request.body.data;
                    _home.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Home page not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/home');
                            response.end();
                        } else {
                            response.cookie('snm', "Home page successfully updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/home');
                            response.end();
                        }
                    });
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.saveHomeCK       = function (request, response) {

    if(request.session.admin){
        Home
            .findOne( { _id: request.params.id } , function (err, _home) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_home) {
            _home.content[request.params.lang] = request.body.content;
            _home.save( function(err) {
                if (err) {
                    response.cookie('snm', "Home not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/home?lang='+request.params.lang);
                    response.end();
                } else {
                    response.cookie('snm', "Home successfully updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/home?lang='+request.params.lang);
                    response.end();
                }
            });
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};


// team page
CPanelController.prototype.get_team             = function (request, response) {

    if(request.session.admin){
        Team.find({})
            .sort({"priority": 1})
            .exec(function (err, _team) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/team/view.jade'), {
                        title               : "MAEUTICA: team list",
                        active_menu         : "team",
                        team                : _team
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_TEAM_MEMBER      = function (request, response) {

    if(request.session.admin){

        var _team       = new Team();
        var nameObj     = {};
            nameObj.en  = request.body.name_en;
            nameObj.ru  = request.body.name_ru;
        _team.name      = nameObj;
        var infoObj     = {};
            infoObj.en  = request.body.biography_en;
            infoObj.ru  = request.body.biography_ru;
        _team.info      = infoObj;

        _team.color     = request.body.color;
        _team.layout    = request.body.layout;
        _team.video     = request.body.video || "";


        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _team.avatar = file._id;

                    _team.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Member not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/team');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Member successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/team');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Member not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/team');
                response.end();
            }
        } else{
            response.cookie('snm', "Member not added! wrong image type or name", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/team');
            response.end();
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_TEAM_MEMBER   = function (request, response) {

    if(request.session.admin){

        var currentTeam       = Object();
        var errors            = Object();
        var hasError          = false;

        Team.findOne( { _id: request.params.id } , function (err, _team) {
            currentTeam = _team;
            if (!_team) {
                errors.general = 'Member not exists.';
                hasError = true;
            }
        }).then(function () {

            if(!hasError){

                var nameObj     = {};
                    nameObj.en  = request.body.name_en;
                    nameObj.ru  = request.body.name_ru;
                currentTeam.name      = nameObj;
                var infoObj     = {};
                    infoObj.en  = request.body.biography_en;
                    infoObj.ru  = request.body.biography_ru;
                currentTeam.info      = infoObj;

                currentTeam.color     = request.body.color;
                currentTeam.layout    = request.body.layout;
                currentTeam.video     = request.body.video || "";

                if(request.file){
                    var mimeType        = request.file.mimetype;

                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (currentTeam.avatar) {
                                gfs.remove({ _id: currentTeam.avatar });
                            }
                            currentTeam.avatar = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        errors.image = "Wrong image type.";
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }

                function _save() {
                    if(hasError){
                        response.cookie('snm', "Member not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/team');
                        response.end();
                    }else {

                        currentTeam.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Member not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/team');
                                response.end();
                            } else {
                                response.cookie('snm', "Member successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/team');
                                response.end();
                            }
                        });
                    }

                }

            } else {
                response.redirect('/control/admin/team');
                response.end();
            }

        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_TEAM_PRIOR    = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Team.findOne({ _id : ObjectId(recipeItem) }).exec(function (err, team) {
                if(err){
                    console.log("wrong query team priority update", err);
                    callback();
                }
            }).then(function (team) {
                team.priority = index;
                team.save(function (err) {
                    if(err){
                        console.log("cannot update team priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err team priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_TEAM          = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Team
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, team) {
                    if(err){
                        response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete team! wrong id", "wrong id")
                    }
                }).then(function (team) {
                    if (team.avatar) {
                        var gfs         = GRIDFS(CONNECTION.db);
                        gfs.remove({ _id: team.avatar });
                    }
                    team.remove();
                    response.cookie('snm', "Member successfully removed!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    ResponseUtils.updated(response, "success");
                })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// portfolio page
CPanelController.prototype.get_portfolio        = function (request, response) {

    if(request.session.admin){
        Portfolio
            .find({})
            .sort({"priority": 1})
            .populate("tags")
            .exec(function (err, _portfolio) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/portfolio/grid.jade'), {
                        title               : "MAEUTICA: portfolio works list",
                        active_menu         : "portfolio",
                        portfolio           : _portfolio
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }
};

CPanelController.prototype.get_portfolio_add    = function (request, response) {

    if(request.session.admin){

        var _tags;
        async.series([
            function _Tags      (cb) {
                Tags.find({})
                    .sort({"priority": 1})
                    .exec(function (err, tags) {
                        if(err){
                            cb(err);
                        } else {
                            _tags = tags;
                            cb();
                        }
                    });
            }
        ], function resolve (err) {
            if(err){
                response.redirect('/503');
                response.end();
            }
            response.render( path.resolve('resources/views/pages/cpanel/portfolio/add.jade'), {
                title               : "MAEUTICA: portfolio add",
                active_menu         : "portfolio",
                tags                : _tags
            });
            response.end();
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_PORTFOLIO        = function (request, response) {

    if(request.session.admin){
        var _portfolio          = new Portfolio();
        var nameObj             = {};
            nameObj.en          = request.body.name_en || "";
            nameObj.ru          = request.body.name_ru || "";
        _portfolio.name         = nameObj;

        var infoObj             = {};
            infoObj.en          = request.body.info_en || "";
            infoObj.ru          = request.body.info_ru || "";
        _portfolio.description  = infoObj;

        _portfolio.dateOfCreate = request.body.create_date || "";
        _portfolio.tags         = request.body.tags || [];
        _portfolio.uniqueName   = request.body.uniqueName.replace(/\ /g, "");

        _portfolio.save(function(err, result) {
            if (err) {
                response.cookie('snm', "Portfolio not added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/portfolio/add');
                response.end();
            } else {
                response.cookie('snm', "Portfolio successfully added! Now you can edit...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/portfolio/edit?section=general&id='+result._id);
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_PORT_PRIORITY = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Portfolio
            .findOne({ _id : ObjectId(recipeItem.priority) }).exec(function (err, _work) {
                if(err){
                    console.log("wrong query portfolio priority update", err);
                    callback();
                }
            }).then(function (_work) {
                _work.priority      = index;
                _work.data_sizey    = recipeItem.data_sizey;
                _work.data_sizex    = recipeItem.data_sizex;
                _work.data_col      = recipeItem.data_col;
                _work.data_row      = recipeItem.data_row;

                _work.save(function (err) {
                    if(err){
                        console.log("cannot update portfolio priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err team priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.PUBLISH_PORT         = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Portfolio
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, _work) {
                    if(err){
                        response.cookie('snm', "Cannot publish! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot publish work! wrong id", "wrong id")
                    }
                }).then(function (_work) {
                _work.isPublished = true;
                _work.save(function (err) {
                    if (err) {
                        response.cookie('snm', "Portfolio is not published!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                    } else {
                        response.cookie('snm', "Portfolio successfully published!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.updated(response, "success");
                    }
                });

            })

        } else{
            response.cookie('snm', "Cannot publish! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot publish! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UNPUBLISH_PORT       = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Portfolio
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, _work) {
                    if(err){
                        response.cookie('snm', "Cannot unpublish! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot publish work! wrong id", "wrong id")
                    }
                }).then(function (_work) {
                _work.isPublished = false;
                _work.save(function (err) {
                    if (err) {
                        response.cookie('snm', "Portfolio is not unpublished!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                    } else {
                        response.cookie('snm', "Portfolio successfully unpublished!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.updated(response, "success");
                    }
                });

            })

        } else{
            response.cookie('snm', "Cannot unpublish! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot publish! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_edit_portfolio   = function (request, response) {

    if(request.session.admin && request.query.id){
        var active_section = "general";
        if(request.query.section){
            active_section = request.query.section;
        }

        var _tags;
        async.series([
            function _Tags      (cb) {
                Tags.find({})
                    .sort({"priority": 1})
                    .exec(function (err, tags) {
                        if(err){
                            cb(err);
                        } else {
                            _tags = tags;
                            cb();
                        }
                    });
            }
        ], function resolve (err) {
            if(err){
                response.redirect('/503');
                response.end();
            } else {
                Portfolio
                    .findOne({ _id : request.query.id })
                    .populate({
                        path: 'content',
                        options: { sort: { 'priority': 1 } }
                    })
                    .exec(function (err, _work) {
                        if(err){
                            response.redirect('/503');
                            response.end();
                        } else {
                            _work.topSlider = _.sortBy(_work.topSlider, 'priority');
                            response.render( path.resolve('resources/views/pages/cpanel/portfolio/edit.jade'), {
                                title               : "MAEUTICA: portfolio edit",
                                active_menu         : "portfolio",
                                active_section      : active_section,
                                tags                : _tags,
                                oldVal              : _work
                            });
                            response.end();
                        }
                    });
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_PORT_GENERAL  = function (request, response) {

    if(request.session.admin){

        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
            if(err){
                console.log("Wrong query when find portfolio");
                response.cookie('snm', "Portfolio not updated! wrong params", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/portfolio/edit?section=general&id='+request.params.id);
                response.end();
            }
        }).then(function (_portfolio) {

            var nameObj         = {};
            nameObj.en          = request.body.name_en;
            nameObj.ru          = request.body.name_ru;
            _portfolio.name     = nameObj;

            var infoObj             = {};
            infoObj.en              = request.body.info_en || "";
            infoObj.ru              = request.body.info_ru || "";
            _portfolio.description  = infoObj;

            _portfolio.dateOfCreate = request.body.create_date || "";
            _portfolio.tags         = request.body.tags || [];
            _portfolio.uniqueName   = request.body.uniqueName.replace(/\ /g, "");

            if(request.body.noPadding && request.body.noPadding == 'on'){
                _portfolio.withPadding   = false;
            } else {
                _portfolio.withPadding   = true;
            }

            _portfolio.save( function(err) {
                if (err) {
                    response.cookie('snm', "General info not updated! wrong fields", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/portfolio/edit?section=general&id='+request.params.id);
                    response.end();
                } else {
                    response.cookie('snm', "General info successfully updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/portfolio/edit?section=general&id='+request.params.id);
                    response.end();
                }
            });

        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_PORT_META     = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){

                _portfolio.meta_keywords   = request.body.m_keywords;
                _portfolio.meta_content    = request.body.m_content;

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_portfolio.shareImage) {
                                gfs.remove({ _id: _portfolio.shareImage });
                            }
                            _portfolio.shareImage = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Meta data not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/portfolio/edit?section=metadata&id='+request.params.id);
                        response.end();
                    }else {
                        _portfolio.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Meta data not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=metadata&id='+request.params.id);
                                response.end();
                            } else {
                                response.cookie('snm', "Meta data successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=metadata&id='+request.params.id);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_PORT_COVER2   = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_portfolio.coverImage) {
                                gfs.remove({ _id: _portfolio.coverImage });
                            }
                            _portfolio.coverImage = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Cover image not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                        response.end();
                    }else {
                        _portfolio.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Cover image not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                                response.end();
                            } else {
                                response.cookie('snm', "Cover image successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_PORT_COVER1   = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_portfolio.alterImage) {
                                gfs.remove({ _id: _portfolio.alterImage });
                            }
                            _portfolio.alterImage = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Cover image not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                        response.end();
                    }else {
                        _portfolio.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Cover image not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                                response.end();
                            } else {
                                response.cookie('snm', "Cover image successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=coverimg&id='+request.params.id);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_PORT_SLIDER      = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){
                var newSlider_noimage = {
                    video    : request.body.video,
                    layout   : request.body.layout,
                    priority : _portfolio.topSlider.length+1
                };

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            var newSlider = {
                                image    : file._id,
                                video    : request.body.video,
                                layout   : request.body.layout,
                                priority : _portfolio.topSlider.length+1
                            };
                            _portfolio.topSlider.push(newSlider);

                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    _portfolio.topSlider.push(newSlider_noimage);
                    _save();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Slider not added! wrong image type or other", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/portfolio/edit?section=topslider&id='+request.params.id);
                        response.end();
                    }else {
                        _portfolio.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Slider not added! wrong image type or other", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=topslider&id='+request.params.id);
                                response.end();
                            } else {
                                response.cookie('snm', "Slider successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=topslider&id='+request.params.id);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.EDIT_PORT_SLIDER     = function (request, response) {

    if(request.session.admin){
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){

                var even1        = _.find(_portfolio.topSlider, function(cl){ return cl["_id"] == request.body.sliderID; });
                var _this_index1 = _.indexOf(_portfolio.topSlider, even1);

                _portfolio.topSlider[_this_index1].video  = request.body.video;
                _portfolio.topSlider[_this_index1].layout = request.body.layout;

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_portfolio.topSlider[_this_index1].image) {
                                gfs.remove({ _id: _portfolio.topSlider[_this_index1].image });
                            }
                            _portfolio.topSlider[_this_index1].image = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        _save();
                    }
                } else {
                    _save();
                }
                function _save() {
                    _portfolio.save( function(err) {
                        if (err) {
                            response.cookie('snm', "Slider not updated! wrong image type or other", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/portfolio/edit?section=topslider&id='+request.params.id);
                            response.end();
                        } else {
                            response.cookie('snm', "Slider successfully updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/portfolio/edit?section=topslider&id='+request.params.id);
                            response.end();
                        }
                    });
                }
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.DELETE_PORT_SLIDER   = function (request, response) {

    if(request.session.admin){
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){
                var gfs = GRIDFS(CONNECTION.db);
                if(_portfolio.topSlider.length == 1){
                    if (_portfolio.topSlider[0].image) {
                        gfs.remove({ _id: _portfolio.topSlider[0].image });
                    }
                    _portfolio.topSlider = [];
                } else {
                    var even2        = _.find(_portfolio.topSlider, function(cl){ return cl["_id"] == request.body.id; });
                    var _this_index2 = _.indexOf(_portfolio.topSlider, even2);

                    var arr = _.without(_portfolio.topSlider, even2);
                    if (_portfolio.topSlider[_this_index2].image) {
                        gfs.remove({ _id: _portfolio.topSlider[_this_index2].image });
                    }
                    _portfolio.topSlider = [] = arr;
                }

                setTimeout(function () {
                    _portfolio.save( function(err) {
                        if (err) {
                            response.cookie('snm', "Slider item not removed! wrong image type or other", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        } else {
                            response.cookie('snm', "Slider item successfully removed!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        }
                    });
                }, 1);
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_SLIDER_PRI    = function (request, response) {

    if(request.session.admin){

        Portfolio
        .findOne( { _id: request.params.id } , function (err, _portfolio) {
            if (err) {
                response.redirect('/503');
                response.end();
            }
        }).then(function (_portfolio) {
                if(_portfolio){
                    var dataArray = request.body.priority;

                    async.forEachOf(dataArray, function(recipeItem, index, callback) {

                        var even        = _.find(_portfolio.topSlider, function(cl){ return cl["_id"] == recipeItem; });
                        var _this_index = _.indexOf(_portfolio.topSlider, even);
                        _portfolio.topSlider[_this_index].priority = index;
                        callback();

                    }, function(err) {
                        if(err) {
                            response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                            console.log("err portfolio slider priority", err);
                        } else {
                            _portfolio.save(function (err) {
                                if(err){
                                    response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                    ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                                    console.log("err portfolio slider priority", err);
                                }
                            }).then(function () {
                                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                ResponseUtils.updated(response, "success");
                            });
                        }
                    });
                } else {
                    response.redirect('/control/admin/portfolio');
                    response.end();
                }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_MEDIA_PORT       = function (request, response) {

    if(request.session.admin){

        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {
                if(_portfolio){

                    var _rowPort            = new PRT_row();
                        _rowPort.priority   = _portfolio.content.length + 1;
                    var _rowPort_content    = [];

                    async.forEachOf(request.body.data, function(recipeItem, index, callback) {

                        if(recipeItem.node == 'image'){

                            var _self = recipeItem;
                            var imageData = recipeItem.elements
                                .replace(/^data:text\/xml;base64,/,'', "")
                                .replace(/^data:image\/(png|gif|jpeg);base64,/,'', "");
                            var _path = ROOT_DIR + "uploads/" + "temp_"+recipeItem.id;

                            fs.writeFile(_path, imageData, {encoding: 'base64'}, function(err){
                                if(err){
                                    console.log(err);
                                    callback(false);
                                } else {

                                    var gfs = GRIDFS(CONNECTION.db);
                                    var writeStream = gfs.createWriteStream({
                                        filename: recipeItem.id
                                    });
                                    fs.createReadStream(_path).pipe(writeStream);
                                    writeStream.on('close', function (file) {
                                        _self.elements = file._id;
                                        fs.unlink(_path);
                                        _rowPort_content.push(_self);
                                        callback();
                                    });
                                    writeStream.on('error', function(err) {
                                        console.log("ERROR writeStream:" + err);
                                        _rowPort_content.push(_self);
                                        fs.unlink(_path);
                                        callback();
                                    });

                                }
                            });

                        } else {
                            _rowPort_content.push(recipeItem);
                            callback();
                        }

                    }, function(err) {
                        if(err) {
                            console.log(err);
                            response.cookie('snm', "Portfolio not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/portfolio/edit?section=media&id='+request.params.id);
                            response.end();
                        } else {

                            var _sorted      = [];
                            async.forEachOf(request.body.data, function(recipeItem2, index2, callback2) {
                                var even        = _.find(_rowPort_content, function(cl){ return cl["id"] == recipeItem2.id; });
                                var _this_index = _.indexOf(_rowPort_content, even);
                                _sorted.push(_rowPort_content[_this_index]);
                                setTimeout(function () {
                                    callback2();
                                }, 100);
                            }, function () {
                                _rowPort.content = _sorted;
                                _rowPort.save(function(err, result) {
                                    if (err) {
                                        response.cookie('snm', "Portfolio not updated!", { maxAge: 900000, httpOnly: false });
                                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                        response.redirect('/control/admin/portfolio/edit?section=media&id='+request.params.id);
                                        response.end();
                                    } else {
                                        // save in portfolio
                                        _portfolio.content.push(result);
                                        _portfolio.save(function (err, success) {
                                            if(err){
                                                response.cookie('snm', "Portfolio not updated!", { maxAge: 900000, httpOnly: false });
                                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                                response.redirect('/control/admin/portfolio/edit?section=media&id='+request.params.id);
                                                response.end();
                                            } else {
                                                response.cookie('snm', "Portfolio successfully updated!", { maxAge: 900000, httpOnly: false });
                                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                                response.redirect('/control/admin/portfolio/edit?section=media&id='+request.params.id);
                                                response.end();
                                            }
                                        });
                                    }
                                });
                            });

                        }
                    });


                } else {
                    response.redirect('/control/admin/portfolio');
                    response.end();
                }
            });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_ROW_SORT      = function (request, response) {

    if(request.session.admin){

        Portfolio
            .findOne( { _id: request.params.id })
            .populate('content')
            .exec( function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

                if(_portfolio){

                    var dataArray = request.body.priority;
                    async.forEachOf(dataArray, function(recipeItem, index, callback) {

                        PRT_row
                            .findOne( { _id: recipeItem })
                            .exec(function (err, rowData) {
                                if(err){
                                    console.log("err portfolio row priority", err);
                                    callback(false);
                                } else {
                                    rowData.priority = index;
                                    rowData.save(function (err) {
                                        if(err){
                                            callback(false);
                                        }
                                    }).then(function () {
                                        callback();
                                    });
                                }
                            });

                    }, function(err) {
                        if(err) {
                            response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                            console.log("err portfolio slider priority", err);
                        } else {
                            response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.updated(response, "success");
                        }
                });
            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.DELETE_ROW_SORT      = function (request, response) {


    if(request.session.admin){
        Portfolio
            .findOne( { _id: request.params.id } , function (err, _portfolio) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_portfolio) {

            if(_portfolio){

                PRT_row
                    .findOne( { _id: request.body.id })
                    .exec(function (err, rowData) {
                        if(err){
                            console.log("err portfolio row del", err);
                            response.cookie('snm', "Section not removed! wrong data", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        } else {
                            _.each(rowData.content, function(_content) {
                                if(_content.node == 'image'){
                                    var gfs = GRIDFS(CONNECTION.db);
                                    gfs.remove({ _id: _content.elements });
                                }
                            });
                            rowData.remove();
                            if(_portfolio.content.length == 1){
                                _portfolio.content = [];
                            } else {
                                var even_        = _.find(_portfolio.content, function(cl){ return cl == request.body.id; });
                                var arr_ = _.without(_portfolio.content, even_);
                                _portfolio.content = [] = arr_;
                            }

                            setTimeout(function () {
                                _portfolio.save( function(err) {
                                    if (err) {
                                        response.cookie('snm', "Section not removed! wrong image type or other", { maxAge: 900000, httpOnly: false });
                                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                                    } else {
                                        response.cookie('snm', "Section successfully removed!", { maxAge: 900000, httpOnly: false });
                                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                        response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                                    }
                                });
                            }, 1);
                        }
                    });


            } else {
                response.redirect('/control/admin/portfolio');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_port_json        = function (request, response) {

    PRT_row
        .findOne({_id : request.params.id})
        .exec( function (err, _section) {
            if (_section == null) {
                ResponseUtils.badRequest(response, err);
            } else {
                ResponseUtils.send(response, _section);
            }
        });

};

CPanelController.prototype.EDIT_MEDIA_PORT      = function (request, response) {

    if(request.session.admin){

        PRT_row
            .findOne( { _id: request.params.id } , function (err, _section) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_section) {

                if(_section) {

                    async.forEachOf(_section.content, function(recipeItem, index, callback) {

                        if(recipeItem.node == 'image'){
                            var gfs = GRIDFS(CONNECTION.db);
                            if (recipeItem.elements) {
                                gfs.remove({ _id: recipeItem.elements });
                            }
                        }
                        callback();

                    }, function(err) {

                        var _NEW_content = [];

                        async.forEachOf(request.body.data, function(recipeItem, index, callback) {

                            if(recipeItem.node == 'image'){

                                var _self = recipeItem;
                                var imageData = recipeItem.elements
                                    .replace(/^data:text\/xml;base64,/,'', "")
                                    .replace(/^data:image\/(xml|png|gif|jpeg);base64,/,'', "");
                                var _path = ROOT_DIR + "uploads/" + "temp_"+recipeItem.id;

                                fs.writeFile(_path, imageData, {encoding: 'base64'}, function(err){
                                    if(err){
                                        console.log(err);
                                        callback(false);
                                    } else {

                                        var gfs = GRIDFS(CONNECTION.db);
                                        var writeStream = gfs.createWriteStream({
                                            filename: recipeItem.id
                                        });
                                        fs.createReadStream(_path).pipe(writeStream);
                                        writeStream.on('close', function (file) {
                                            _self.elements = file._id;
                                            fs.unlink(_path);
                                            _NEW_content.push(_self);
                                            setTimeout(function () {
                                                callback();
                                            }, 0);
                                        });
                                        writeStream.on('error', function(err) {
                                            console.log("ERROR writeStream:" + err);
                                            _NEW_content.push(_self);
                                            fs.unlink(_path);
                                            setTimeout(function () {
                                                callback();
                                            }, 0);
                                        });

                                    }
                                });

                            } else {
                                _NEW_content.push(recipeItem);
                                setTimeout(function () {
                                    callback();
                                }, 0);
                            }

                        }, function(err) {
                            if(err) {
                                console.log(err);
                                response.cookie('snm', "Portfolio not updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/portfolio/edit?section=media&id='+request.body.portId);
                                response.end();
                            } else {
                                _section.content = [];
                                var _sorted      = [];
                                async.forEachOf(request.body.data, function(recipeItem2, index2, callback2) {
                                    var even        = _.find(_NEW_content, function(cl){ return cl["id"] == recipeItem2.id; });
                                    var _this_index = _.indexOf(_NEW_content, even);
                                    _sorted.push(_NEW_content[_this_index]);
                                    setTimeout(function () {
                                        callback2();
                                    }, 100);
                                }, function () {
                                    _section.content = _sorted;
                                    _section.save(function(err, result) {
                                        if (err) {
                                            response.cookie('snm', "Portfolio not updated!", { maxAge: 900000, httpOnly: false });
                                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                            response.redirect('/control/admin/portfolio/edit?section=media&id='+request.body.portId);
                                            response.end();
                                        } else {
                                            response.cookie('snm', "Portfolio successfully updated!", { maxAge: 900000, httpOnly: false });
                                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                            response.redirect('/control/admin/portfolio/edit?section=media&id='+request.body.portId);
                                            response.end();
                                        }
                                    });
                                });

                            }
                        });

                    });


                } else {
                    response.redirect('/control/admin/portfolio');
                    response.end();
                }

            });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// recent works
CPanelController.prototype.get_recent           = function (request, response) {

    if(request.session.admin){
        Recent
            .find({})
            .sort({"priority": 1})
            .populate("work")
            .exec(function (err, _recent) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {

                    Portfolio
                        .find({})
                        .select('_id name')
                        .sort({"priority": 1})
                        .exec(function (err, _portfolio) {
                            if(err){
                                response.redirect('/503');
                                response.end();
                            } else {
                                response.render( path.resolve('resources/views/pages/cpanel/recent/view.jade'), {
                                    title               : "MAEUTICA: recent works",
                                    active_menu         : "recent",
                                    recent              : _recent,
                                    portfolio           : _portfolio
                                });
                                response.end();
                            }
                        });

                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_RECENT           = function (request, response) {

    if(request.session.admin){

        var _recent     = new Recent();
        _recent.work    = request.body.recentWork;

        _recent.save(function(err) {
            if (err) {
                response.cookie('snm', "Recent works not added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/recent');
                response.end();

            } else {
                response.cookie('snm', "Recent works successfully added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/recent');
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_RECENT_PRIOR  = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;
        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Recent
                .findOne({ _id : ObjectId(recipeItem) }).exec(function (err, _recent) {
                    if(err){
                        console.log("wrong query recent priority update", err);
                        callback();
                    }
                }).then(function (_recent) {
                    _recent.priority = index;
                    _recent.save(function (err) {
                        if(err){
                            console.log("cannot update recent priority", err);
                            callback();
                        } else {
                            callback();
                        }
                    });
                });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err team priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_RECENT        = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Recent
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, _recent) {
                    if(err){
                        response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete recent! wrong id", "wrong id")
                    }
                }).then(function (_recent) {
                _recent.remove();
                response.cookie('snm', "Recent rork successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// tags page
CPanelController.prototype.get_tags             = function (request, response) {

    if(request.session.admin){
        Tags.find({})
            .sort({"priority": 1})
            .exec(function (err, _tags) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/tags/view.jade'), {
                        title               : "MAEUTICA: tags list",
                        active_menu         : "tags",
                        tags                : _tags
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_TAGS             = function (request, response) {

    if(request.session.admin){
        var _tag        = new Tags();
        var nameObj     = {};
        nameObj.en      = request.body.name_en;
        nameObj.ru      = request.body.name_ru;
        _tag.name       = nameObj;

        _tag.save(function(err) {
            if (err) {
                response.cookie('snm', "Tag not added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/tags');
                response.end();
            } else {
                response.cookie('snm', "Tag successfully added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/tags');
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_TAGS          = function (request, response) {

    if(request.session.admin){

        Tags.findOne( { _id: request.params.id } , function (err, _tag) {
            if(err){
                console.log("Wrong query when find tag");
                response.cookie('snm', "Tag not updated! wrong params", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/tags');
                response.end();
            }
        }).then(function (_tag) {

            var nameObj         = {};
            nameObj.en          = request.body.name_en;
            nameObj.ru          = request.body.name_ru;
            _tag.name           = nameObj;

            _tag.save( function(err) {
                if (err) {
                    response.cookie('snm', "Tag not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/tags');
                    response.end();
                } else {
                    response.cookie('snm', "Tag successfully updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/tags');
                    response.end();
                }
            });

        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_TAGS_PRIOR    = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Tags.findOne({ _id : ObjectId(recipeItem) }).exec(function (err, tag) {
                if(err){
                    console.log("wrong query tag priority update", err);
                    callback();
                }
            }).then(function (tag) {
                tag.priority = index;
                tag.save(function (err) {
                    if(err){
                        console.log("cannot update tag priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err team priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_TAGS          = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Tags
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, tag) {
                    if(err){
                        response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete tgs! wrong id", "wrong id")
                    }
                }).then(function (tag) {
                // TODO: find all jobs where use this tag and before remove
                tag.remove();
                response.cookie('snm', "Tag successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }
};

// offices
CPanelController.prototype.get_offices          = function (request, response) {

    if(request.session.admin){
        Offices
            .find({})
            .sort({"priority": 1})
            .exec(function (err, _offices) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/offices/view.jade'), {
                        title               : "MAEUTICA: offices list",
                        active_menu         : "offices",
                        offices             : _offices
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_offices_add      = function (request, response) {

    if(request.session.admin){

        response.render( path.resolve('resources/views/pages/cpanel/offices/add.jade'), {
            title               : "MAEUTICA: offices add",
            active_menu         : "offices"
        });
        response.end();

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }
};

CPanelController.prototype.ADD_OFFICES          = function (request, response) {

    if(request.session.admin){
        var _office     = new Offices();
        var nameObj     = {};
            nameObj.en  = request.body.name_en;
            nameObj.ru  = request.body.name_ru;

        var addressObj      = {};
            addressObj.en  = request.body.address_en;
            addressObj.ru  = request.body.address_ru;

        _office.name                = nameObj;
        _office.uniqueName          = request.body.name_en.replace(" ", "").toLowerCase();
        _office.address             = addressObj;
        _office.layout              = request.body.layout;
        _office.main_video_night    = request.body.main_video_night;
        _office.main_video_morning  = request.body.main_video_morning;
        _office.email               = request.body.email;
        _office.timezone            = request.body.timezone;
        _office.phone               = request.body.phone;
        _office.main_color          = request.body.main_color;
        _office.location            = {
            lat : request.body.lat,
            lng : request.body.lng
        };

        async.series([
            function _main_image_morning (cb) {
                if(request.files['main_image_morning'][0]){
                    var _file = request.files['main_image_morning'][0];
                    var gfs = GRIDFS(CONNECTION.db);
                    var writeStream = gfs.createWriteStream({
                        filename: _file.originalname
                    });
                    fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                    writeStream.on('close', function (file) {
                        _office.main_image_morning = file._id;
                        fs.unlink(ROOT_DIR + _file.path);
                        cb();
                    });
                    writeStream.on('error', function(err) {
                        console.log("ERROR writeStream:" + err);
                        fs.unlink(ROOT_DIR + _file.path);
                        cb();
                    });
                } else {
                    cb();
                }
            },
            function _main_image_night (cb) {
                if(request.files['main_image_night'][0]){
                    var _file = request.files['main_image_night'][0];
                    var gfs = GRIDFS(CONNECTION.db);
                    var writeStream = gfs.createWriteStream({
                        filename: _file.originalname
                    });
                    fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                    writeStream.on('close', function (file) {
                        _office.main_image_night = file._id;
                        fs.unlink(ROOT_DIR + _file.path);
                        cb();
                    });
                    writeStream.on('error', function(err) {
                        console.log("ERROR writeStream:" + err);
                        fs.unlink(ROOT_DIR + _file.path);
                        cb();
                    });
                } else {
                    cb();
                }
            }
        ], function resolve (err) {
            if(err){
                response.redirect('/503');
                response.end();
            }
            // clients images
            if(request.files['client_image']){

                async.forEachOf(request.files['client_image'], function(recipeItem, index, callback) {

                    var _file       = recipeItem;
                    var gfs         = GRIDFS(CONNECTION.db);
                    var writeStream = gfs.createWriteStream({
                        filename: _file.originalname
                    });
                    fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                    writeStream.on('close', function (file) {
                        _office.clients.push({
                            name     : {
                                en : request.body.client_name_en[index],
                                ru : request.body.client_name_ru[index]
                            },
                            image    : file._id,
                            priority : index,
                            id       : idGenerator(50, false)
                        });
                        fs.unlink(ROOT_DIR + _file.path);
                        callback();
                    });
                    writeStream.on('error', function(err) {
                        console.log("ERROR writeStream:" + err);
                        fs.unlink(ROOT_DIR + _file.path);
                        callback();
                    });


                }, function(err) {
                    if(err) {
                        console.log(err);
                    }
                    _office.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Office not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/offices/add');
                            response.end();
                        } else {
                            response.cookie('snm', "Office successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/offices');
                            response.end();
                        }
                    });
                });

            } else {
                _office.save(function(err) {
                    if (err) {
                        response.cookie('snm', "Office not added!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/offices/add');
                        response.end();
                    } else {
                        response.cookie('snm', "Office successfully added!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/offices');
                        response.end();
                    }
                });
            }
        });


    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_OFFICES_PRIOR = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Offices.findOne({ _id : ObjectId(recipeItem) }).exec(function (err, office) {
                if(err){
                    console.log("wrong query offices priority update", err);
                    callback();
                }
            }).then(function (office) {
                office.priority = index;
                office.save(function (err) {
                    if(err){
                        console.log("cannot update offices priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err office priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_OFFICES       = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Offices
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, office) {
                    if(err){
                        response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete office! wrong id", "wrong id")
                    }
                }).then(function (office) {
                var gfs         = GRIDFS(CONNECTION.db);
                if (office.main_image_night) {
                    gfs.remove({ _id: office.main_image_night });
                }
                if (office.main_image_morning) {
                    gfs.remove({ _id: office.main_image_morning });
                }
                office.remove();
                response.cookie('snm', "Office successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete office! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_office_edit      = function (request, response) {

    if(request.session.admin && request.params.id){
        Offices
            .findOne({ _id : request.params.id })
            .exec(function (err, _office) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    if(_office){
                        var _clients = _.sortBy(_office.clients, function(o) { return o.priority; });
                        _office.clients = _clients;
                        response.render( path.resolve('resources/views/pages/cpanel/offices/edit.jade'), {
                            title               : "MAEUTICA: offices edit",
                            active_menu         : "offices",
                            office              : _office,
                            oldVal              : _office
                        });
                        response.end();
                    } else {
                        response.redirect('/404');
                        response.end();
                    }
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_OFFICE        = function (request, response) {

    if(request.session.admin){

        Offices
            .findOne( { _id: request.params.id } , function (err, _office) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
        }).then(function (_office) {

            if(_office){

                var nameObj     = {};
                nameObj.en      = request.body.name_en;
                nameObj.ru      = request.body.name_ru;

                var addressObj  = {};
                addressObj.en   = request.body.address_en;
                addressObj.ru   = request.body.address_ru;

                _office.name                = nameObj;
                _office.uniqueName          = request.body.name_en.replace(" ", "").toLowerCase();
                _office.address             = addressObj;
                _office.layout              = request.body.layout;
                _office.main_video_night    = request.body.main_video_night;
                _office.main_video_morning  = request.body.main_video_morning;
                _office.email               = request.body.email;
                _office.timezone            = request.body.timezone;
                _office.phone               = request.body.phone;
                _office.main_color          = request.body.main_color;
                _office.location            = {
                    lat : request.body.lat,
                    lng : request.body.lng
                };

                async.series([
                    function _main_image_morning (cb) {
                        if(request.files && request.files['main_image_morning'] && request.files['main_image_morning'][0]){
                            var _file       = request.files['main_image_morning'][0];
                            var gfs         = GRIDFS(CONNECTION.db);
                            var writeStream = gfs.createWriteStream({
                                filename: _file.originalname
                            });

                            fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);

                            writeStream.on('close', function (file) {
                                if (_office.main_image_morning) {
                                    gfs.remove({ _id: _office.main_image_morning });
                                }
                                _office.main_image_morning = file._id;
                                fs.unlink(ROOT_DIR + _file.path);
                                cb();
                            });
                            writeStream.on('error', function(err) {
                                console.log("ERROR writeStream:" + err);
                                fs.unlink(ROOT_DIR + _file.path);
                                cb();
                            });
                        } else {
                            cb();
                        }
                    },
                    function _main_image_night   (cb) {
                        if(request.files && request.files['main_image_night'] && request.files['main_image_night'][0]){
                            var _file = request.files['main_image_night'][0];
                            var gfs = GRIDFS(CONNECTION.db);
                            var writeStream = gfs.createWriteStream({
                                filename: _file.originalname
                            });
                            fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                            writeStream.on('close', function (file) {
                                if (_office.main_image_night) {
                                    gfs.remove({ _id: _office.main_image_night });
                                }
                                _office.main_image_night = file._id;
                                fs.unlink(ROOT_DIR + _file.path);
                                cb();
                            });
                            writeStream.on('error', function(err) {
                                console.log("ERROR writeStream:" + err);
                                fs.unlink(ROOT_DIR + _file.path);
                                cb();
                            });
                        } else {
                            cb();
                        }
                    }
                ], function resolve (err) {
                    if (err) {
                        response.redirect('/503');
                        response.end();
                    }
                    // clients update
                    async.series([
                        function _removeClients (cb) {
                            if (request.body["client_remove"]) {
                                var _tempClients    = [];
                                    _tempClients    = _office.clients;
                                if(Array.isArray(request.body["client_remove"])){
                                    async.forEachOf(request.body["client_remove"], function(recipeItem, index, callback) {

                                        var even        = _.find(_tempClients, function(cl){ return cl["id"] == recipeItem; });
                                        var gfs         = GRIDFS(CONNECTION.db);
                                        var _this_index = _.indexOf(_office.clients, even);
                                        if (_tempClients[_this_index].image) {
                                            gfs.remove({ _id: _tempClients[_this_index].image });
                                        }
                                        _office.clients.splice(_this_index, 1);
                                        callback();

                                    }, function(err) {
                                        if(err) {
                                            console.log(err);
                                        }
                                        cb();
                                    });
                                } else {
                                    var even        = _.find(_tempClients, function(cl){ return cl["id"] == request.body["client_remove"]; });
                                    var gfs         = GRIDFS(CONNECTION.db);
                                    var _this_index = _.indexOf(_office.clients, even);
                                    if (_tempClients[_this_index].image) {
                                        gfs.remove({ _id: _tempClients[_this_index].image });
                                    }
                                    _office.clients.splice(_this_index, 1);
                                    cb();
                                }
                            } else {
                                cb()
                            }
                        },
                        function _updateDataClients (cb) {

                            var _newFileIndex = 0;
                            if(Array.isArray(request.body["client_name_en"])){
                                async.forEachOf(request.body["client_name_en"], function(recipeItem, index, callback) {
                                    // if new client
                                    if (request.body["old_client_id"][index] == "new") {

                                        var _file       = request.files['client_image'][_newFileIndex];
                                        var gfs         = GRIDFS(CONNECTION.db);
                                        var writeStream = gfs.createWriteStream({
                                            filename: _file.originalname
                                        });
                                        fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                                        writeStream.on('close', function (file) {
                                            _office.clients.push({
                                                name     : {
                                                    en : request.body.client_name_en[index],
                                                    ru : request.body.client_name_ru[index]
                                                },
                                                image    : file._id,
                                                priority : index,
                                                id       : idGenerator(50, false)
                                            });
                                            fs.unlink(ROOT_DIR + _file.path);
                                            callback();
                                        });
                                        writeStream.on('error', function(err) {
                                            console.log("ERROR writeStream:" + err);
                                            fs.unlink(ROOT_DIR + _file.path);
                                            callback();
                                        });
                                        _newFileIndex++;


                                    } else {
                                        // if client update
                                        var even        = _.find(_office.clients, function(cl){ return cl["id"] == request.body["old_client_id"][index]; });
                                        var _this_index = _.indexOf(_office.clients, even);

                                        _office.clients[_this_index].name = {
                                            en : request.body.client_name_en[index],
                                            ru : request.body.client_name_ru[index]
                                        };
                                        _office.clients[_this_index].priority = index;

                                        callback();
                                    }

                                }, function(err) {
                                    if(err) {
                                        console.log(err);
                                    }
                                    cb();
                                });
                            } else {

                                if (request.body["old_client_id"] && request.body["old_client_id"] === "new") {
                                    var _file       = request.files['client_image'][0];
                                    var gfs         = GRIDFS(CONNECTION.db);
                                    var writeStream = gfs.createWriteStream({
                                        filename: _file.originalname
                                    });
                                    fs.createReadStream(ROOT_DIR + _file.path).pipe(writeStream);
                                    writeStream.on('close', function (file) {
                                        _office.clients.push({
                                            name     : {
                                                en : request.body.client_name_en,
                                                ru : request.body.client_name_ru
                                            },
                                            image    : file._id,
                                            priority : 0,
                                            id       : idGenerator(50, false)
                                        });
                                        fs.unlink(ROOT_DIR + _file.path);
                                        cb();
                                    });
                                    writeStream.on('error', function(err) {
                                        console.log("ERROR writeStream:" + err);
                                        fs.unlink(ROOT_DIR + _file.path);
                                        cb();
                                    });
                                    _newFileIndex++;


                                } else {
                                    // if client update
                                    if(request.body["old_client_id"]){
                                        var even        = _.find(_office.clients, function(cl){ return cl["id"] == request.body["old_client_id"]; });
                                        var _this_index = _.indexOf(_office.clients, even);

                                        _office.clients[_this_index].name = {
                                            en : request.body.client_name_en,
                                            ru : request.body.client_name_ru
                                        };
                                        _office.clients[_this_index].priority = 0;
                                        cb();
                                    } else {
                                        cb();
                                    }
                                }
                            }


                        }
                    ], function resolve(err) {
                        if (err) {
                            response.redirect('/503');
                            response.end();
                        }

                        _office.save(function(err) {
                            if (err) {
                                response.cookie('snm', "Office not updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/offices/edit/'+request.params.id);
                                response.end();
                            } else {
                                response.cookie('snm', "Office successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/offices/edit/'+request.params.id);
                                response.end();
                            }
                        });

                    });

                });

            } else {
                response.redirect('/control/admin/offices/edit/'+request.params.id);
                response.end();
            }

        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// services
CPanelController.prototype.get_services         = function (request, response) {

    if(request.session.admin){

        var lang    = "en";
        if(request.query.lang && request.query.lang == "ru") lang = "ru";

        Services
            .findOne({})
            .sort({"priority": 1})
            .exec(function (err, _services) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    console.log("_services", _services.content[lang]);
                    response.render( path.resolve('resources/views/pages/cpanel/services/view.jade'), {
                        title               : "MAEUTICA: services list",
                        active_menu         : "services",
                        lang                : lang,
                        services            : _services
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }


};

CPanelController.prototype.saveServicesCK       = function (request, response) {

    if(request.session.admin){
        Services
            .findOne( { _id: request.params.id } , function (err, _service) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_service) {
            _service.content[request.params.lang] = request.body.content;
            _service.save( function(err) {
                if (err) {
                    response.cookie('snm', "Service not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/services');
                    response.end();
                } else {
                    response.cookie('snm', "Service successfully updated!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/services');
                    response.end();
                }
            });
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_SERVICE          = function (request, response) {

    if(request.session.admin){

        var _service       = new Services();
        var nameObj     = {};
        nameObj.en      = request.body.name_en;
        nameObj.ru      = request.body.name_ru;
        _service.name   = nameObj;
        var infoObj     = {};
        infoObj.en      = request.body.info_en;
        infoObj.ru      = request.body.info_ru;
        _service.info   = infoObj;

        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _service.icon = file._id;

                    _service.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Service not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/services');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Service successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/services');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Service not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/services');
                response.end();
            }
        } else{

            _service.save(function(err) {
                if (err) {
                    response.cookie('snm', "Service not added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/services');
                    response.end();

                } else {
                    response.cookie('snm', "Service successfully added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/services');
                    response.end();
                }
            });
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_SERVICE       = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Services
            .findOne( { _id: request.params.id } , function (err, _service) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_service) {

                if(_service){
                    var nameObj     = {};
                    nameObj.en      = request.body.name_en;
                    nameObj.ru      = request.body.name_ru;
                    _service.name   = nameObj;
                    var infoObj     = {};
                    infoObj.en      = request.body.info_en;
                    infoObj.ru      = request.body.info_ru;
                    _service.info   = infoObj;
                    if(request.file){
                        var mimeType        = request.file.mimetype;
                        if (mimeType.lastIndexOf('image/') === 0) {
                            var gfs = GRIDFS(CONNECTION.db);
                            var writeStream = gfs.createWriteStream({
                                filename: request.file.originalname
                            });
                            fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                            writeStream.on('close', function (file) {
                                if (_service.icon) {
                                    gfs.remove({ _id: _service.icon });
                                }
                                _service.icon = file._id;
                                fs.unlink(ROOT_DIR + request.file.path);
                                _save();
                            });
                        } else {
                            hasError = true;
                            _save();
                        }
                    } else {
                        _save();
                    }
                    function _save() {
                        if(hasError){
                            response.cookie('snm', "Service not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/services');
                            response.end();
                        }else {
                            _service.save( function(err) {
                                if (err) {
                                    response.cookie('snm', "Service not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                    response.redirect('/control/admin/services');
                                    response.end();
                                } else {
                                    response.cookie('snm', "Service successfully updated!", { maxAge: 900000, httpOnly: false });
                                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                    response.redirect('/control/admin/services');
                                    response.end();
                                }
                            });
                        }
                    }
                } else {
                    response.redirect('/control/admin/services');
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_SERVICE_PRIOR = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Services.findOne({ _id : ObjectId(recipeItem) }).exec(function (err, service) {
                if(err){
                    console.log("wrong query services priority update", err);
                    callback();
                }
            }).then(function (service) {
                service.priority = index;
                service.save(function (err) {
                    if(err){
                        console.log("cannot update service priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err service priority", err)
            } else {
                response.cookie('snm', "Priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_SERVICE       = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Services
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, service) {
                    if(err){
                        response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete service! wrong id", "wrong id")
                    }
                }).then(function (service) {
                var gfs         = GRIDFS(CONNECTION.db);
                if (service.icon) {
                    gfs.remove({ _id: service.icon });
                }
                service.remove();
                response.cookie('snm', "Service successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// headers
CPanelController.prototype.get_headers          = function (request, response) {

    if(request.session.admin){
        var option = {
            page : "landing"
        };
        if(request.query.page){
            option.page = request.query.page;
        }
        Headers
            .find(option)
            .sort({"priority": 1})
            .exec(function (err, _headers) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/headers/view.jade'), {
                        title               : "MAEUTICA: header banners",
                        active_menu         : "headers",
                        tab                 : option.page,
                        headers             : _headers
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_headers_add      = function (request, response) {

    if(request.session.admin){
        var option = {
            page : "landing"
        };
        if(request.query.page){
            option.page = request.query.page;
        }
        Portfolio
            .find({})
            .select('uniqueName name')
            .sort({"priority": 1})
            .exec(function (err, _portfolio) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/headers/add.jade'), {
                        title               : "MAEUTICA: header banners add",
                        active_menu         : "headers",
                        tab                 : option.page,
                        portfolio           : _portfolio
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_HEADER           = function (request, response) {

    if(request.session.admin){

        var _header             = new Headers();
        _header.layout          = request.body.layout;
        _header.video           = request.body.video || "";
        _header.page            = request.query.page;
        _header.is_portfolio    = request.body.portfolioItem;
        if(request.body.portfolioItem){
            _header.portfolio_url   = request.body.portfolio_url;
        } else {
            _header.portfolio_url   = 'null';
        }

        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {
                    _header.image = file._id;
                    _header.save(function(err) {
                        if (err) {
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.cookie('snm', "Banner not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/headers/add?page='+request.query.page);
                            response.end();

                        } else {
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.cookie('snm', "Banner successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/headers?page='+request.query.page);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Banner not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/headers/add?page='+request.query.page);
                response.end();
            }
        } else{

            _header.save(function(err) {
                if (err) {
                    response.cookie('snm', "Banner not added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/headers/add?page='+request.query.page);
                    response.end();

                } else {
                    response.cookie('snm', "Banner successfully added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/headers?page='+request.query.page);
                    response.end();
                }
            });
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.get_headers_edit     = function (request, response) {

    if(request.session.admin){
        Headers
            .findOne({ _id : request.params.id })
            .exec(function (err, _header) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {

                    Portfolio
                        .find({})
                        .select('uniqueName name')
                        .sort({"priority": 1})
                        .exec(function (err, _portfolio) {
                            if(err){
                                response.redirect('/503');
                                response.end();
                            } else {
                                response.render( path.resolve('resources/views/pages/cpanel/headers/edit.jade'), {
                                    title               : "MAEUTICA: header banner edit",
                                    active_menu         : "headers",
                                    oldVal              : _header,
                                    portfolio           : _portfolio
                                });
                                response.end();
                            }
                        });

                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_HEARER        = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Headers
            .findOne( { _id: request.params.id } , function (err, _header) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_header) {

            if(_header){

                _header.layout          = request.body.layout;
                _header.video           = request.body.video || "";
                _header.is_portfolio    = request.body.portfolioItem;
                if(request.body.portfolioItem){
                    _header.portfolio_url   = request.body.portfolio_url;
                } else {
                    _header.portfolio_url   = 'null';
                }

                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_header.image) {
                                gfs.remove({ _id: _header.image });
                            }
                            _header.image = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Banner not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/headers?page='+_header.page);
                        response.end();
                    }else {
                        _header.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Service not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/headers?page='+_header.page);
                                response.end();
                            } else {
                                response.cookie('snm', "Service successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/headers?page='+_header.page);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/headers');
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_HEADER_PRIOR  = function (request, response) {

    if(request.session.admin){

        var dataArray = request.body.priority;

        async.forEachOf(dataArray, function(recipeItem, index, callback) {
            Headers
                .findOne({ _id : ObjectId(recipeItem) })
                .exec(function (err, header) {
                    if(err){
                        console.log("wrong query services priority update", err);
                        callback();
                    }
            }).then(function (header) {
                header.priority = index;
                header.save(function (err) {
                    if(err){
                        console.log("cannot update header priority", err);
                        callback();
                    } else {
                        callback();
                    }
                });
            });

        }, function(err) {
            if(err) {
                response.cookie('snm', "Banners priority not updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                ResponseUtils.badRequest(response, ResponseUtils.removeProperties(err.errors));
                console.log("err service priority", err)
            } else {
                response.cookie('snm', "Banners priority successfully updated!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            }
        });

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_HEADER        = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            Headers
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, header) {
                    if(err){
                        response.cookie('snm', "Header banner delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete team! wrong id", "wrong id")
                    }
                }).then(function (header) {
                if (header.image) {
                    var gfs         = GRIDFS(CONNECTION.db);
                    gfs.remove({ _id: header.image });
                }
                header.remove();
                response.cookie('snm', "Header banner successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// footers
CPanelController.prototype.get_footers          = function (request, response) {

    if(request.session.admin){
        var option = {
            page : "landing"
        };
        if(request.query.page){
            option.page = request.query.page;
        }
        Footers
            .findOne(option)
            .exec(function (err, _footers) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/footers/view.jade'), {
                        title               : "MAEUTICA: footers images",
                        active_menu         : "footers",
                        tab                 : option.page,
                        footers             : _footers || false
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_FOOTERS          = function (request, response) {

    if(request.session.admin){

        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    var _footer         = new Footers();
                        _footer.image   = file._id;
                        _footer.page    = request.query.page;

                    _footer.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Footer image not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/footers?page='+request.query.page);
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Footer imge successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/footers?page='+request.query.page);
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Footer image not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/footers?page='+request.query.page);
                response.end();
            }
        } else{
            response.cookie('snm', "Footer image not added! wrong image type.", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/footers?page='+request.query.page);
            response.end();
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.UPDATE_FOOTERS       = function (request, response) {

    if(request.session.admin){
        var hasError          = false;
        Footers
            .findOne( { _id: request.params.id } , function (err, _footer) {
                if (err) {
                    response.redirect('/503');
                    response.end();
                }
            }).then(function (_footer) {

            if(_footer){
                if(request.file){
                    var mimeType        = request.file.mimetype;
                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (_footer.image) {
                                gfs.remove({ _id: _footer.image });
                            }
                            _footer.image = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        hasError = true;
                        _save();
                    }
                } else {
                    response.cookie('snm', "Footer not updated! wrong image type.", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/footers?page='+_footer.page);
                    response.end();
                }
                function _save() {
                    if(hasError){
                        response.cookie('snm', "Footer not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/footers?page='+_footer.page);
                        response.end();
                    }else {
                        _footer.save( function(err) {
                            if (err) {
                                response.cookie('snm', "Footer not updated! wrong image type or name", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/footers?page='+_footer.page);
                                response.end();
                            } else {
                                response.cookie('snm', "Footer successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/footers?page='+_footer.page);
                                response.end();
                            }
                        });
                    }
                }
            } else {
                response.redirect('/control/admin/footers?page='+_footer.page);
                response.end();
            }
        });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// blog
CPanelController.prototype.get_blog             = function (request, response) {

    if(request.session.admin){
        response.render( path.resolve('resources/views/pages/cpanel/blog/view.jade'), {
            title               : "MAEUTICA: blog list",
            active_menu         : "blog",
            blog                : false
        });
        response.end();
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }
};

CPanelController.prototype.get_media_files      = function (request, response) {

    if(request.session.admin){

        MediaData
            .find({})
            .exec(function (err, _mediaData) {
                if(err){
                    response.redirect('/503');
                    response.end();
                } else {
                    response.render( path.resolve('resources/views/pages/cpanel/media_files/view.jade'), {
                        title               : "MAEUTICA: media files",
                        active_menu         : "media-files",
                        mediaFiles          : _mediaData
                    });
                    response.end();
                }
            });
    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.ADD_MEDIA_FILES      = function (request, response) {

    if(request.session.admin){

        var _mFIle             = new MediaData();
        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {
                    _mFIle.image = file._id;
                    _mFIle.save(function(err) {
                        if (err) {
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.cookie('snm', "Image not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/media-files');
                            response.end();

                        } else {
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.cookie('snm', "Image successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/media-files');
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Image not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/media-files');
                response.end();
            }
        } else{

            response.cookie('snm', "Image not added! wrong image type", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/media-files');
            response.end();
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

CPanelController.prototype.REMOVE_MEDIA_FILES   = function (request, response) {

    if(request.session.admin){

        if(request.body.id){
            MediaData
                .findOne({_id : ObjectId(request.body.id)})
                .exec(function (err, _mediaData) {
                    if(err){
                        response.cookie('snm', "Image cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
                        console.log("Cannot delete image data! wrong id", "wrong id")
                    }
                }).then(function (_mediaData) {

                if (_mediaData.image) {
                    var gfs         = GRIDFS(CONNECTION.db);
                    gfs.remove({ _id: _mediaData.image });
                }
                _mediaData.remove();
                response.cookie('snm', "Image successfully removed!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                ResponseUtils.updated(response, "success");
            })

        } else{
            response.cookie('snm', "Cannot delete! wrong id", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            ResponseUtils.badRequest(response, ResponseUtils.removeProperties({err: "wrong id"}));
            console.log("Cannot delete! wrong id", "wrong id")
        }

    } else {
        response.redirect('/control/admin/oauth/login');
        response.end();
    }

};

// export
module.exports = new CPanelController();
