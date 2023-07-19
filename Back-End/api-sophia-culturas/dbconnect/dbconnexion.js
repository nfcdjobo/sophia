const mongoose = require('mongoose');
const Domaine = require('../models/domaineModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
// const data = require('./data');

const data = [
    {
        email: 'sophia.culturas@gmail.com',
        nomPrenom: 'Sophia Culturas',
        nationalite: 'IVOIRIENNE',
        photo: ' ',
        entite: 'GESTIONNAIRE',
        telephone: '0101010101',
        pass: 'sophiaculturas'
    },
    {
        email: 'djobo@gmail.com',
        nomPrenom: "DJOBO N'DRI FRANCOIS CAREM",
        nationalite: 'IVOIRIENNE',
        photo: ' ',
        entite: 'GESTIONNAIRE',
        telephone: '0101010101',
        photo: " ",
        pass: 'DJOBO'
        
    }
];

mongoose.connect(`mongodb+srv://nfcdjobo:nfcdjobo@sophiaculturas.xkymogx.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connexion éffectuée avec succès');
    Domaine.findOne({libelle: "GESTIONNAIRE"})
    .then(domaine => {
        if(!domaine){
            const newDomaine = new Domaine({libelle: "GESTIONNAIRE", photo: " "})
            newDomaine.save()
            .then(newDom => {
                data.forEach(item => {
                    User.findOne({email: item.email})
                    .then(user => {
                        if(!user){
                            bcrypt.hash(item.pass, 10)
                            .then(hash => {
                                const admin = new User({...item, password: hash, domaine_id: newDom._id});
                                admin.save()
                                .then(adm => {
                                    console.log(adm);
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                })
            })
        }else{
            data.forEach(item => {
                User.findOne({email: item.email})
                .then(user => {
                    if(!user){
                        bcrypt.hash(item.pass, 10)
                        .then(hash => {
                            const admin = new User({...item, password: hash, domaine_id: domaine._id,});
                            admin.save()
                            .then(adm => {
                                console.log(true);
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            })
        }
    })
    .catch(error => {
        console.log(error);
    })

    Domaine.findOne({libelle: 'ADMIRATEUR'})
    .then(admirateur => {
        if(!admirateur){
            const newDomaine = new Domaine({libelle: 'ADMIRATEUR', photo: ' '})
            newDomaine.save()
            .then(newDom => {
                console.log(true);
            })
            .catch(error => {
                console.log(error);
            })
        }
    })
    .catch(error => {
        console.log(error);
    })
})
.catch(error=>{
    console.log(`Connexin non établie: \n ${error}`);
})
module.exports = mongoose;


