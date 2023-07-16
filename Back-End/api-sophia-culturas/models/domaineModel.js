const mongoose = require('mongoose');
const domaineSchema = mongoose.Schema(
    {
        libelle:{
            type: String,
            required: true
        },
        photo:{
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
const Domaine = mongoose.model('domaine', domaineSchema);
module.exports = Domaine;