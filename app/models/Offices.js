/**
 *   Offices schema
 **/

var config                  = require('../../config')[APP_ENV],
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema;

var officesSchema_name      = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
}),
officesSchema_address   = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
    }),
officesSchema_clientsN  = new Schema({
    en : {
        type : String,
        default: ""
    },
    ru : {
        type : String,
        default: ""
    }
});

var officesSchema = new Schema({
    name                : officesSchema_name,
    uniqueName          : {
        type : String,
        default: "secterofficename",
        index : true
    },
    main_image_night    : {
        type        : Schema.ObjectId
    },
    main_image_morning  : {
        type        : Schema.ObjectId
    },
    main_video_night    : {
        type        : String,
        default     : ""
    },
    main_video_morning  : {
        type        : String,
        default     : ""
    },
    main_color          : {
        type : String,
        default : "#fff"
    },
    address             : officesSchema_address,
    phone               : {
        type        : String,
        default     : ""
    },
    email               : {
        type        : String,
        default     : ""
    },
    timezone            : {
        type        : String,
        default     : ""
    },
    location            : {
        lat : {
            type : Number
        },
        lng : {
            type : Number
        }
    },
    clients             : [{
        id      :    {
            type    : String,
            default : ""
        },
        name     : officesSchema_clientsN,
        image    : Schema.Types.ObjectId,
        priority : {
            type : Number,
            default : 1
        }
    }],
    priority            : {
        type : Number,
        default : 1
    },
    layout              : {
        type        : String,
        default     : "image"
    },
    created_at          : {
        type        : Date,
        default     : Date.now,
        required    : true
    }
});

module.exports = mongoose.model('Offices', officesSchema);