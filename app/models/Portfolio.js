/**
 *   Portfolio schema
 **/
var config                    = require('../../config')[APP_ENV],
    mongoose                  = require('mongoose'),
    uniqueValidator           = require('mongoose-unique-validator');
    Schema                    = mongoose.Schema;

var portfolioSchema_name      = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});
var portfolioSchema_desc      = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});
var portfolioSchema_moreInfo  = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});
var portfilioSlider           = new Schema({
    image: {
        type : Schema.ObjectId
    },
    video: {
        type : String,
        default: ""
    },
    layout: {
        type : String,
        default: "image"
    },
    priority : {
        type: Number,
        default: 1,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

var portfolioSchema = new Schema({
    name            : portfolioSchema_name,
    uniqueName      : {
        type        : String,
        required    : "'{PATH}' is  required.",
        unique      : true
    },
    dateOfCreate    : {
        type        : String,
        default     : ""
    },
    tags            : [{
        type        : Schema.Types.ObjectId,
        index       : true,
        ref         : 'Tags'
    }],
    shareImage      : {
        type        : Schema.Types.ObjectId
    },
    coverImage      : {
        type        : Schema.Types.ObjectId
    },
    alterImage      : {
        type        : Schema.Types.ObjectId
    },
    meta_keywords   : {
        type        : String,
        default     : ""
    },
    meta_content    : {
        type        : String,
        default     : ""
    },
    description     : portfolioSchema_desc,
    topSlider       : [portfilioSlider],
    priority        : {
        type        : Number,
        default     : 1
    },
    data_sizey      : {
        type        : Number,
        default     : 2
    },
    data_sizex      : {
        type        : Number,
        default     : 2
    },
    data_col      : {
        type        : Number,
        default     : 4
    },
    data_row      : {
        type        : Number,
        default     : 1
    },
    isPublished     : {
        type        : Boolean,
        default     : false
    },
    withPadding     : {
        type        : Boolean,
        default     : true
    },
    moreInfo        : portfolioSchema_moreInfo, // ckEditor
    content         : [{
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'PRT_row'
    }],
    created_at      : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

portfolioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Portfolio', portfolioSchema);