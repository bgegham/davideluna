module.exports = {
    development: {
        baseUrl             : "http://37.186.125.214:1516",
        secret              : 'cssdbf5047ess9s4e0d8ff9a87f4b5acb92abb8sds26662ff2d5c74e33d1e24e0af7ssaa904825ae63ls967418s98b1effd06531s15637cdca372bff0004f035',
        mongo_url           : 'mongodb://127.0.0.1:27017/davideluna',
        SENDGRID_API_KEY    : "",
        office_fromEmail    : "office@help.email",
        office_toEmail      : "b.gegham@gmail.com",
        http_port           : 1516,
        http_host           : '0.0.0.0'
    },
    production: {
        baseUrl             : "http://176.32.196.113:9191",
        secret              : 'c6ddbf5047efc9s4e0d8sssa87f4b5acb92abb8sdd26562ff2ssc74e33d1e24e0af7ssaa9048slae632e967418s98b1effd06531s15637cdca372bff0004f035',
        mongo_url           : 'mongodb://127.0.0.1:27017/maeutica_DB',
        SENDGRID_API_KEY    : "",
        office_fromEmail    : "office@help.email",
        office_toEmail      : "b.gegham@gmail.com",
        http_port           : 9191,
        http_host           : '0.0.0.0'
    }
};