/**
 *   Services schema
 **/

var config                  = require('../../config')[APP_ENV],
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema;

var servicesSchema = new Schema({
    content     : {
        en : {
            type : String,
            default: ""
        },
        ru : {
            type : String,
            default: ""
        }
    },
    created_at  : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

module.exports = mongoose.model('Services', servicesSchema);