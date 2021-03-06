module.exports = function(app, multipart) {

    var requestCountry                          = require('request-country'),
        siteController                          = require('../controllers/siteController');

    app.use('/',                                requestCountry.middleware({ attributeName: 'cCode' }));

    app.get('/',                                multipart.array(), function(req, res){ siteController.aboutPage(req, res); });

    app.get('/home',                            multipart.array(), function(req, res){ siteController.aboutPage(req, res); });

    app.get('/my-works',                          multipart.array(), function(req, res){ siteController.coversPage(req, res); });

    app.get('/news',                       multipart.array(), function(req, res){ siteController.portfolioPage(req, res); });

    app.get('/news/:uniqueName',           multipart.array(), function(req, res){ siteController.portfolioDetailPage(req, res); });

    app.get('/bio',                       multipart.array(), function(req, res){ siteController.servicesPage(req, res); });

    app.get('/genres',                          multipart.array(), function(req, res){ siteController.officesPage(req, res); });

    // app.get('/genres-detail',                   multipart.array(), function(req, res){ siteController.officeDetailPage(req, res); });

    app.post('/genres-detail/send-email',       multipart.array(), function(req, res){ siteController.officeSendEmail(req, res); });

    app.get('/contacts',                        multipart.array(), function(req, res){ siteController.officeDetailPage(req, res); });

    app.get('/404',                             multipart.array(), function(req, res){ siteController.pageNotFound(req, res); });

    app.get('/images/:id',                      function(req, res) { siteController.imageShow(req, res); });

};