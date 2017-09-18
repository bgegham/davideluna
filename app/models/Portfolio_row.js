/**
 *   Portfolio one row content schema
 **/

var config                  = require('../../config')[APP_ENV],
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema;

var portfolioRowSchema = new Schema({
    content     : {
        type : Array,
        default:  []
    },
    priority    : {
        type    : Number,
        default : 1
    },
    created_at  : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

module.exports = mongoose.model('PRT_row', portfolioRowSchema);