const Commentaire = require("../models/commentaireModel");
const Exposition = require("../models/expositionModel");
const User = require("../models/userModel");

class commentaireContoller{
    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static async create(req, res){
        console.log(req.body)
        try {
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                }else{
                    Exposition.findById(req.body.exposition)
                    .then(exposition=>{
                        if(exposition){
                            new Commentaire({...req.body}).save()
                            .then(comment => {
                                console.log("Commentaire ajouté avec succès", comment);
                                res.status(200).json({msg: "Commentaire ajouté avec succès.", data: comment});
                            })
                            .catch(error => {
                                console.log("Erreur survenue, commentaire non pris en compte.", error);
                                res.status(401).json({msg: "Erreur survenue, commentaire non pris en compte.", error: error.message})
                            })
                        }else{
                            console.log("Cette exposition n'existe pas.");
                            res.status(401).json({msg: "Cette exposition n'existe pas."})
                        }
                    })
                    .catch(error => {
                        console.log("Erreur survenue, commentaire non pris en compte.", error);
                        res.status(401).json({msg: "Erreur survenue, commentaire non pris en compte.", error: error.message})
                    })
                }
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la mise à jour.");
                res.status(400).json({msg: "Une érreur est survenue lors de la mise à jour.", error: error.message})
            })
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors de l'enregistrememnt", error: error.message})
        }
    }
}

module.exports = commentaireContoller;