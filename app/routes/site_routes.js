module.exports = function(app, multipart) {

    var requestCountry                          = require('request-country'),
        siteController                          = require('../controllers/siteController');

    app.use('/',                                requestCountry.middleware({ attributeName: 'cCode' }));

    app.get('/',                                multipart.array(), function(req, res){ siteController.landingPage(req, res); });

    app.get('/about',                           multipart.array(), function(req, res){ siteController.aboutPage(req, res); });

    app.get('/portfolio',                       multipart.array(), function(req, res){ siteController.portfolioPage(req, res); });

    app.get('/portfolio/:uniqueName',           multipart.array(), function(req, res){ siteController.portfolioDetailPage(req, res); });

    app.get('/services',                        multipart.array(), function(req, res){ siteController.servicesPage(req, res); });

    app.get('/offices',                         multipart.array(), function(req, res){ siteController.officesPage(req, res); });

    app.get('/office-detail',                   multipart.array(), function(req, res){ siteController.officeDetailPage(req, res); });

    app.post('/office-detail/send-email',       multipart.array(), function(req, res){ siteController.officeSendEmail(req, res); });

    app.get('/team',                            multipart.array(), function(req, res){ siteController.teamPage(req, res); });

    app.get('/404',                             multipart.array(), function(req, res){ siteController.pageNotFound(req, res); });

    app.get('/images/:id',                      function(req, res) { siteController.imageShow(req, res); });

};