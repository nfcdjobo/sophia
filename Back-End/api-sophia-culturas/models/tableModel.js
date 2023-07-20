const mongoose = require('mongoose');
const User = require('./userModel');
const tableSchema = mongoose.Schema(
    {
        titre:{
            type: String,
            required: true
        },
        sousTitre:{
            type: String,
            required: true
        },
        resume:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        photo:{
            type: String,
            required: true
        },
        user_id:[
            {type: mongoose.Schema.Types.ObjectId, ref: User}
        ],
        statut:{
            type: Number,
            default: 1,
            required: true
        },
        etat:{
            type: Number,
            default: 1,
            required: true
        },
        createdAt:{
            type: Date,
            required: true,
            default: new Date()
        },
        updatedAt:{
            type: Date,
            required: true,
            default: new Date()
        }
    },
    {
        timesTamps: true
    }
);
const Table = mongoose.model('table', tableSchema);
module.exports = Table;

