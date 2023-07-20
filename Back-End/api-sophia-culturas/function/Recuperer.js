const Banniere = require('../models/banniereModel');
const Service = require('../models/serviceModel');
const Table = require('../models/tableModel');


function Recuperer(Requete, Reponse) {
    try {
        let Entite = (Requete.params.entite === 'banniere' ? Banniere : Requete.params.entite === 'service' ? Service : Requete.params.entite === 'table' ? Table : undefined);
        if (!Entite) {
            console.log("Entité introuvable.");
            Reponse.status(400).json({msg: "Entité introuvable."});
        } else {
            Entite.find({}).then(all => Reponse.status(200).json({data:all}))
            .catch(error => {
                console.log("Erreur survenue", error);
                Reponse.status(500).json({msg:"Mot de passe ou email incorrect", error: error.message})
            })
        }
    } catch (error) {
        console.log("Une érreur est survenué lors du traîtement de la requête", error);
        Reponse.status(400).json({msg: "Mot de passe ou email incorrect", error: error.message});
    }
}

module.exports = Recuperer;