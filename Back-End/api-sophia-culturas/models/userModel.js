const mongoose = require('mongoose');
const Domaine = require('./domaineModel');
const userSchema = mongoose.Schema(
    {
        nomPrenom:{
            type: String,
            required: true
        },
        nationalite:{
            type: String,
            required: true
        },
        domaine_id:[
            {type: mongoose.Schema.Types.ObjectId, ref: Domaine}
        ],
        photo:{
            type: String,
            required: true
        },
        entite:{
            type: String,
            required: true,
            default: 'GESTIONNAIRE'
        },
        email:{
            type: String,
            required: true
        },
        telephone:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },

        facebook:{
            type: String,
            required: false
        },
        twitter:{
            type: String,
            required: false
        },
        instagram:{
            type: String,
            required: false
        },
        linkedIn:{
            type: String,
            required: false
        },
        youtube:{
            type: String,
            required: false
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
const User = mongoose.model('user', userSchema);
module.exports = User;
