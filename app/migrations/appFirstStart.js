/**
 * Migrate emulation
 */

var md5                 = require('MD5'),
    Admin               = require('../models/Admin'),
    Home                = require('../models/Home'),
    Landing             = require('../models/Landing'),
    Services            = require('../models/Services');

// create super admin
Admin.find({}, function(err, admins){
    if (err) {
        console.log("error on create admin", err);
    } else {
        if (admins) {
            if(admins.length == 0){
                var admin = new Admin();
                admin.username               = "admin";
                admin.password               = md5("admin");
                admin.save(function(err){
                    if(err){
                        console.log("**************************************************************************************");
                        console.log("*************************  Can't create first admin  *********************************");
                        console.log("**************************************************************************************");
                    } else {
                        console.log("**************************************************************************************");
                        console.log("**********************  Automatically create admin  **********************************");
                        console.log("**********************                              **********************************");
                        console.log("**********************  USERNAME :    admin         **********************************");
                        console.log("**********************  PASSWORD :    admin         **********************************");
                        console.log("**************************************************************************************");
                    }
                });
            }
        }
    }
});
// create home def content
Home.find({}, function(err, home){
    if (err) {
        console.log(err);
    } else {
        if (home) {
            if(home.length == 0){
                var home = new Home();
                home.save();
            }
        }
    }
});
// create landing def content
Landing.find({}, function(err, landing){
    if (err) {
        console.log(err);
    } else {
        if (landing) {
            if(landing.length == 0){
                var landing = new Landing();
                landing.save();
            }
        }
    }
});
// create services def content
Services.find({}, function(err, services){
    if (err) {
        console.log(err);
    } else {
        if (services) {
            if(services.length == 0){
                var services = new Services();
                services.save();
            }
        }
    }
});