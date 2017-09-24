module.exports = function(app, multipart) {

    var cPanelController          = require('../controllers/cPanelController');
    var multer                    = require('multer');
    var upload                    = multer({ dest: 'uploads/' });

//  PUBLIC PAGES

    // login page
    app.get('/control/admin/oauth/login',       multipart.array(),          function(req, res){ cPanelController.get_login(req, res); });

    // create user session on login
    app.post('/control/admin/oauth/login',      multipart.array(),          function(req, res){ cPanelController.CREATE_SESSION(req, res); });

    // destroy session and log out
    app.post('/control/admin/oauth/logout',     multipart.array(),          function(req, res){ cPanelController.DESTROY_SESSION(req, res); });

//  PRIVATE PAGES

    // greeting
    app.get('/control/admin/greeting',          multipart.array(),          function(req, res){ cPanelController.get_greeting(req, res); });

    // landing
    app.get('/control/admin/landing',                   multipart.array(),         function(req, res){ cPanelController.get_landing(req, res); });
    app.post('/control/admin/landing/save/:id/:lang',   multipart.array(),         function(req, res){ cPanelController.saveLandingCK(req, res)});

    //covers
    app.get('/control/admin/covers',              multipart.array(),          function(req, res){ cPanelController.get_covers(req, res); });
    app.post('/control/admin/covers/save/:id/:lang',       multipart.array(),         function(req, res){ cPanelController.saveCoversCK(req, res)});


    // home
    app.get('/control/admin/home',              multipart.array(),          function(req, res){ cPanelController.get_home(req, res); });
    app.get('/control/admin/home/json',         multipart.array(),          function(req, res){ cPanelController.get_home_json(req, res); });
    app.post('/control/admin/home',             multipart.array(),          function(req, res){ cPanelController.ADD_HOME_CONTENT(req, res); });
    app.post('/control/admin/home/save/:id/:lang',       multipart.array(),         function(req, res){ cPanelController.saveHomeCK(req, res)});

    // team
    app.get( '/control/admin/team',             multipart.array(),          function(req, res){ cPanelController.get_team(req, res); });
    app.post('/control/admin/team/add',         multipart.single('avatar'), function(req, res){ cPanelController.ADD_TEAM_MEMBER(req, res); });
    app.post('/control/admin/team/edit/:id',    multipart.single('avatar'), function(req, res){ cPanelController.UPDATE_TEAM_MEMBER(req, res); });
    app.post('/control/admin/team/priority',    multipart.array(),          function(req, res){ cPanelController.UPDATE_TEAM_PRIOR(req, res); });
    app.post('/control/admin/team/remove',      multipart.array(),          function(req, res){ cPanelController.REMOVE_TEAM(req, res); });

    // portfolio
    app.get('/control/admin/portfolio',                     multipart.array(),          function(req, res){ cPanelController.get_portfolio(req, res); });
    app.get('/control/admin/portfolio/add',                 multipart.array(),          function(req, res){ cPanelController.get_portfolio_add(req, res); });
    app.post('/control/admin/portfolio/add',                multipart.array(),          function(req, res){ cPanelController.ADD_PORTFOLIO(req, res); });
    app.post('/control/admin/portfolio/priority',           multipart.array(),          function(req, res){ cPanelController.UPDATE_PORT_PRIORITY(req, res); });
    app.post('/control/admin/portfolio/publish',            multipart.array(),          function(req, res){ cPanelController.PUBLISH_PORT(req, res); });
    app.post('/control/admin/portfolio/unpublish',          multipart.array(),          function(req, res){ cPanelController.UNPUBLISH_PORT(req, res); });
    app.get('/control/admin/portfolio/edit',                multipart.array(),          function(req, res){ cPanelController.get_edit_portfolio(req, res); });

    app.post('/control/admin/portfolio/edit/general/:id',   multipart.array(),          function(req, res){ cPanelController.UPDATE_PORT_GENERAL(req, res); });
    app.post('/control/admin/portfolio/edit/metadata/:id',  multipart.single('image_m'),function(req, res){ cPanelController.UPDATE_PORT_META(req, res); });
    app.post('/control/admin/portfolio/edit/coverimg2/:id', multipart.single('image_c'),function(req, res){ cPanelController.UPDATE_PORT_COVER2(req, res); });
    app.post('/control/admin/portfolio/edit/coverimg1/:id', multipart.single('image_c'),function(req, res){ cPanelController.UPDATE_PORT_COVER1(req, res); });

    app.post('/control/admin/portfolio/add/topsleder/:id',  multipart.single('image_t'),function(req, res){ cPanelController.ADD_PORT_SLIDER(req, res); });
    app.post('/control/admin/portfolio/edit/topsleder/:id', multipart.single('image_t'),function(req, res){ cPanelController.EDIT_PORT_SLIDER(req, res); });
    app.post('/control/admin/portfolio/sort/topsleder/:id', multipart.array(),          function(req, res){ cPanelController.UPDATE_SLIDER_PRI(req, res); });
    app.post('/control/admin/portfolio/del/topsleder/:id',  multipart.array(),          function(req, res){ cPanelController.DELETE_PORT_SLIDER(req, res); });

    app.post('/control/admin/portfolio/add/media/:id',      multipart.array(),          function(req, res){ cPanelController.ADD_MEDIA_PORT(req, res); });
    app.post('/control/admin/portfolio/sort/sections/:id',  multipart.array(),          function(req, res){ cPanelController.UPDATE_ROW_SORT(req, res); });
    app.post('/control/admin/portfolio/del/sections/:id',   multipart.array(),          function(req, res){ cPanelController.DELETE_ROW_SORT(req, res); });
    app.get('/control/admin/portfolio/section/json/:id',    multipart.array(),          function(req, res){ cPanelController.get_port_json(req, res); });
    app.post('/control/admin/portfolio/edit/media/:id',     multipart.array(),          function(req, res){ cPanelController.EDIT_MEDIA_PORT(req, res); });

    // recent works
    app.get('/control/admin/recent',            multipart.array(),          function(req, res){ cPanelController.get_recent(req, res); });
    app.post('/control/admin/recent/add',       multipart.array(),          function(req, res){ cPanelController.ADD_RECENT(req, res); });
    app.post('/control/admin/recent/priority',  multipart.array(),          function(req, res){ cPanelController.UPDATE_RECENT_PRIOR(req, res); });
    app.post('/control/admin/recent/remove',    multipart.array(),          function(req, res){ cPanelController.REMOVE_RECENT(req, res); });


    // tags
    app.get('/control/admin/tags',              multipart.array(),          function(req, res){ cPanelController.get_tags(req, res); });
    app.post('/control/admin/tags/add',         multipart.array(),          function(req, res){ cPanelController.ADD_TAGS(req, res); });
    app.post('/control/admin/tags/edit/:id',    multipart.array(),          function(req, res){ cPanelController.UPDATE_TAGS(req, res); });
    app.post('/control/admin/tags/priority',    multipart.array(),          function(req, res){ cPanelController.UPDATE_TAGS_PRIOR(req, res); });
    app.post('/control/admin/tags/remove',      multipart.array(),          function(req, res){ cPanelController.REMOVE_TAGS(req, res); });

    // offices
    app.get('/control/admin/offices',           multipart.array(),          function(req, res){ cPanelController.get_offices(req, res); });
    app.get('/control/admin/offices/add',       multipart.array(),          function(req, res){ cPanelController.get_offices_add(req, res); });
    var officesFiles                            = upload.fields([
            { name: 'main_image_morning',   maxCount: 1 },
            { name: 'main_image_night',     maxCount: 1 },
            { name: 'client_image',         maxCount: 100 }
        ]);
    app.post('/control/admin/offices/add',      officesFiles,               function(req, res){ cPanelController.ADD_OFFICES(req, res); });
    app.post('/control/admin/offices/priority', multipart.array(),          function(req, res){ cPanelController.UPDATE_OFFICES_PRIOR(req, res); });
    app.post('/control/admin/offices/remove',   multipart.array(),          function(req, res){ cPanelController.REMOVE_OFFICES(req, res); });
    app.get('/control/admin/offices/edit/contacts',  multipart.array(),          function(req, res){ cPanelController.get_office_edit(req, res); });
    app.post('/control/admin/offices/edit/contacts', officesFiles,               function(req, res){ cPanelController.UPDATE_OFFICE(req, res); });

    // services
    app.get('/control/admin/services',           multipart.array(),         function(req, res){ cPanelController.get_services(req, res); });
    app.post('/control/admin/services/add',      multipart.single('icon'),  function(req, res){ cPanelController.ADD_SERVICE(req, res); });
    app.post('/control/admin/services/edit/:id', multipart.single('icon'),  function(req, res){ cPanelController.UPDATE_SERVICE(req, res); });
    app.post('/control/admin/services/priority', multipart.array(),         function(req, res){ cPanelController.UPDATE_SERVICE_PRIOR(req, res); });
    app.post('/control/admin/services/remove',   multipart.array(),         function(req, res){ cPanelController.REMOVE_SERVICE(req, res); });
    app.post('/control/admin/services/save/:id/:lang',       multipart.array(),         function(req, res){ cPanelController.saveServicesCK(req, res)});

    // headers
    app.get('/control/admin/headers',            multipart.array(),         function(req, res){ cPanelController.get_headers(req, res); });
    app.get('/control/admin/headers/add',        multipart.array(),         function(req, res){ cPanelController.get_headers_add(req, res); });
    app.post('/control/admin/headers/add',       multipart.single('image'), function(req, res){ cPanelController.ADD_HEADER(req, res); });
    app.get('/control/admin/headers/edit/:id',   multipart.array(),         function(req, res){ cPanelController.get_headers_edit(req, res); });
    app.post('/control/admin/headers/edit/:id',  multipart.single('image'), function(req, res){ cPanelController.UPDATE_HEARER(req, res); });
    app.post('/control/admin/headers/priority',  multipart.array(),         function(req, res){ cPanelController.UPDATE_HEADER_PRIOR(req, res); });
    app.post('/control/admin/headers/remove',    multipart.array(),         function(req, res){ cPanelController.REMOVE_HEADER(req, res); });

    // footers
    app.get('/control/admin/footers',            multipart.array(),         function(req, res){ cPanelController.get_footers(req, res); });
    app.post('/control/admin/footers/add',       multipart.single('image'), function(req, res){ cPanelController.ADD_FOOTERS(req, res); });
    app.post('/control/admin/footers/edit/:id',  multipart.single('image'), function(req, res){ cPanelController.UPDATE_FOOTERS(req, res); });

    // blog
    app.get('/control/admin/blog',               multipart.array(),         function(req, res){ cPanelController.get_blog(req, res); });

    // media files
    app.get('/control/admin/media-files',        multipart.array(),         function(req, res){ cPanelController.get_media_files(req, res); });
    app.post('/control/admin/media-files/add',   multipart.single('image'), function(req, res){ cPanelController.ADD_MEDIA_FILES(req, res); });
    app.post('/control/admin/media-files/remove',multipart.array(),         function(req, res){ cPanelController.REMOVE_MEDIA_FILES(req, res); });


};