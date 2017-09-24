/**
 *   Covers page content schema
 **/

var config                  = require('../../config')[APP_ENV],
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema;

var coversSchema = new Schema({
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

module.exports = mongoose.model('Covers', coversSchema);
