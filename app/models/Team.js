/**
 *   Team members schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    uniqueValidator     = require('mongoose-unique-validator');

var teamSchema_name = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
}),
    teamSchema_info = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});

var teamSchema = new Schema({
    name        : teamSchema_name,
    info        : teamSchema_info,
    priority    : {
        type : Number,
        default : 1
    },
    color       : {
        type        : String,
        default     : "red"
    },
    avatar      : {
        type        : Schema.ObjectId
    },
    video       : {
        type        : String,
        default     : ""
    },
    layout      : {
        type        : String,
        default     : "image"
    },
    created_at  : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

teamSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Team', teamSchema);