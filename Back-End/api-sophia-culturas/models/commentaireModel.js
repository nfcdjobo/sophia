const mongoose = require('mongoose');
const Exposition = require('./expositionModel');
const User = require('./userModel');

const commentaireSchema = mongoose.Schema(
    {
        commentateur:[
            {type: mongoose.Schema.Types.ObjectId, ref: User}
        ],
        auteur:[
            {type: mongoose.Schema.Types.ObjectId, ref: User}
        ],

        exposition:[
            {type: mongoose.Schema.Types.ObjectId, ref: Exposition}
        ],
        titre:{
            type: String,
            required: true
        },
        contenu:{
            type: String,
            required: true
        },
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
const Commentaire = mongoose.model('commentaire', commentaireSchema);
module.exports = Commentaire;