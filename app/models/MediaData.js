/**
 *   Media files schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var mediaData = new Schema({
    image       : {
        type    : Schema.ObjectId
    },
    created_at  : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

module.exports = mongoose.model('MediaData', mediaData);