const mongoose = require('mongoose');
const User = require('./userModel');

const messagerieSchema = mongoose.Schema(
    {
        nomPrenom:{
            type: String,
            required: true
        },

        email:{
            type: String,
            required: true
        },

        telephone:{
            type: String,
            required: true
        },

        motif:{
            type: String,
            required: true
        },

        message:{
            type: String,
            required: true
        },
        lecteur:[
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
const Messagerie = mongoose.model('messagerie', messagerieSchema);
module.exports = Messagerie;