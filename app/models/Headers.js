/**
 *   Header elements schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var headersSchema = new Schema({
    image    : {
        type : Schema.ObjectId
    },
    video    : {
        type : String,
        default : ""
    },
    layout   : {
        type : String,
        default : "image"
    },
    is_portfolio : {
        type : Boolean,
        default : false
    },
    portfolio_url      : {
        type : String,
        default : ""
    },
    page     : {
        type : String,
        default : ""
    },
    priority : {
        type : Number,
        default : 1
    },
    created_at: {
        type : Date,
        default : Date.now,
        required : true
    }
});

module.exports = mongoose.model('Headers', headersSchema);