/**
 *   Portfolio tags schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var tagsSchema_name = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});

var tagsSchema = new Schema({
    name        : tagsSchema_name,
    priority    : {
        type : Number,
        default : 1
    },
    created_at  : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

tagsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Tags', tagsSchema);