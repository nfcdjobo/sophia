const mongoose = require('mongoose');
const Exposition = require('./expositionModel');
const User = require('./userModel');

const likeSchema = mongoose.Schema(
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
const Like = mongoose.model('like', likeSchema);
module.exports = Like;