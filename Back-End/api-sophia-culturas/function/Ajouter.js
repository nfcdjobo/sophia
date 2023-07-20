const Banniere = require('../models/banniereModel');
const Service = require('../models/serviceModel');
const Table = require('../models/tableModel');
const Messagerie = require('../models/messagerieModel');


function Ajouter(ModeleUser, Requete, Reponse){
    try {
        console.log("#################", Requete.body);
        ModeleUser.findOne({_id: Requete.auth.user_id ,email: Requete.auth.user_email})
        .then(userAuth => {
            if(!userAuth){
                console.log("Vous n'êtes pas autorisé(e) à effectuer cette requête");
                Reponse.status(202).json({msg:"Vous n'êtes pas autorisé(e) à effectuer cette requête"});
            }else {
                let Entite = (Requete.body.entite=='banniere' ? Banniere : Requete.body.entite=='service' ? Service : Requete.body.entite=='table' ? Table : undefined);
                if(!Entite){
                    console.log("Entité introuvable.");
                    Reponse.status(400).json({msg: "Entité introuvable."});
                }else {
                    let Bienvenue = new  Entite({ ... Requete.body, user_id: Requete.auth.user_id});
                    Bienvenue.save()
                    .then(nouveau => {
                        console.log("Enregistrement effectué avec succès", nouveau);
                        Reponse.status(201).json({data: nouveau});
                    })
                    .catch(error => {
                        console.log("Une érreur est survenue lors du traitement de l'enregistrement", error);
                        Reponse.status(401).json({msg: "Une érreur est survenue lors du traitement de l'enregistrement", error: error});
                    })
                }
            }
        })
        .catch(error => {
            console.log("Une érreur est survenue lors du traitement de l'enregistrement", error);
            Reponse.status(401).json({msg: "Une érreur est survenue lors du traitement de l'enregistrement", error: error});
        })
    }catch (error) {
        console.log("Une érreur est survenue lors du traitement de l'enregistrement", error);
        Reponse.status(401).json({msg: "Une érreur est survenue lors du traitement de l'enregistrement", error: error});
    }
}

module.exports = Ajouter;