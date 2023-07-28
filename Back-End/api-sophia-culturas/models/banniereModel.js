const mongoose = require('mongoose');
const User = require('./userModel');
const banniereSchema = mongoose.Schema(
    {
        accueil:{
            type: String,
            required: true
        },
        plateforme:{
            type: String,
            default: "SOPHIA-CULTURAS",
            required: true
        },
        sigle:{
            type: String,
            default: "(S-!-C)",
            required: true
        },
        photo:{
            type: String,
            required: false
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
const Banniere = mongoose.model('banniere', banniereSchema);
module.exports = Banniere;

