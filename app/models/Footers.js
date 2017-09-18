/**
 *   Footer elements schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var footersSchema = new Schema({
    image    : {
        type : Schema.ObjectId
    },
    page     : {
        type : String,
        default : ""
    },
    created_at: {
        type : Date,
        default : Date.now,
        required : true
    }
});

module.exports = mongoose.model('Footers', footersSchema);