const Banniere = require('../models/banniereModel');
const Service = require('../models/serviceModel');
const Table = require('../models/tableModel');


function Modifier(ModeleUser, Requete, Reponse){
    try{
        ModeleUser.findOne({_id: Requete.auth.user_id ,email: Requete.auth.user_email})
        .then(userAuth => {
            if (!userAuth) {
                console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête");
                Reponse.status(202).json({msg: "Mot de passe ou email incorrect."});
            } else {
                let Entite = (Requete.body.entite == 'banniere' ? Banniere : Requete.body.entite == 'service' ? Service : Requete.body.entite == 'table' ? Table : undefined);
                if (!Entite) {
                    console.log("Entité introuvable.");
                    Reponse.status(400).json({msg: "Entité introuvable."});
                } else {
                    console.log(Requete.body);
                    Entite.findOne({_id: Requete.body.id})
                    .then(item => {
                        if(!item){
                            console.log("Information à modifier n'existe pas.");
                            Reponse.status(202).json({msg: "Information à modifier n'existe pas."});
                        }else {
                            Entite.updateOne({_id: item._id}, {...Requete.body, user_id: Requete.auth.user_id, updatedAt: new Date()})
                            .then(updated => {
                                Entite.findById(item._id)
                                .then(newInformations => {
                                    console.log(newInformations)
                                    Reponse.status(201).json({msg: "Nouvelle information", data: newInformations});
                                })
                                .catch(error => {
                                    console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête" , error);
                                    Reponse.status(202).json({msg: "Mot de passe ou email incorrect.", error :error});
                                })
                            })
                            .catch(error => {
                                console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête" , error);
                                Reponse.status(202).json({msg: "Mot de passe ou email incorrect.", error :error});
                            })
                        }
                    })
                    .catch(error => {
                        console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête" , error);
                        Reponse.status(202).json({msg: "Mot de passe ou email incorrect.", error :error});
                    })
                }
            }
        })
        .catch(error => {
            console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête" , error);
            Reponse.status(202).json({msg: "Mot de passe ou email incorrect.", error :error});
        })
    }catch (error) {
        console.log("Une érreur est survenue lors de la récupération des informations.", error);
        Reponse.status(401).json({msg: "Une érreur est survenue lors de la récupération des informations.", error: error});
    }
}

module.exports = Modifier;