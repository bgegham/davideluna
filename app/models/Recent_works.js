/**
 *   Recent_works elements schema
 **/

var config              = require('../../config')[APP_ENV],
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var RecentWorksSchema = new Schema({
    work     : {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Portfolio'
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

module.exports = mongoose.model('RecentWorks', RecentWorksSchema);