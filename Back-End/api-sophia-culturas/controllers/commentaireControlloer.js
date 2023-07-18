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
                                console.log("Commentaire ajouté avec succès");
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

    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static async getCommentByAutor(req, res){
        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                }else{
                    Commentaire.find({auteur: req.auth.user_id, statut: 1})
                    .then(comment => {
                        res.status(200).json({msg: "Requête prise en compte", data: comment})
                    })
                    .catch(error => {
                        console.log("Une érreur est survenue lors de la mise à jour.");
                        res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                    })
                }
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
            })

        }catch (error) {
            res.status(500).json({msg:"Mot de passe ou email incorrect.", error: error.message})
        }
    }

    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static async getAllComment(req, res){
        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
                .then(auth => {
                    if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                        res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                    }else{
                        Commentaire.find({statut: 1})
                        .then(comment => {
                            res.status(200).json({msg: "Requête prise en compte", data: comment.filter(item => item.auteur === req.auth.user_id)})
                        })
                        .catch(error => {
                            console.log("Une érreur est survenue lors de la mise à jour.");
                            res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                        })
                    }
                })
                .catch(error => {
                    console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                    res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                })

        }catch (error) {
            res.status(500).json({msg:"Mot de passe ou email incorrect.", error: error.message})
        }
    }

    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static async getCommentJoint(req, res){
        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
                .then(auth => {
                    if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                        res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                    }else{
                        Commentaire.find({auteur: req.auth.user_id, statut: 1})
                        .populate({
                            path:"exposition",
                            populate:{
                                path: "user_id"
                            }
                        })
                        //.populate('commentateu')
                        .then(coment =>{
                            Commentaire.find({auteur: req.auth.user_id, statut: 1})
                            .populate("commentateur")
                            .then(commentAndUser => {
                                res.status(200).json({msg: "find", data: [coment, commentAndUser]})
                            })
                        })
                    }
                })
                .catch(error => {
                    console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                    res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                })

        }catch (error) {
            res.status(500).json({msg:"Mot de passe ou email incorrect.", error: error.message})
        }
    }

    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static  async update(req, res){
        console.log("----------------------------------------------------------------------------")
        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                }else{
                    Commentaire.findById(req.body.id)
                    .then(comment => {
                        if(!comment){
                            res.status(400).json({msg: "Mot de passe ou email incorrect."})
                        }else{
                            Commentaire.updateOne({_id: req.body.id, statut: 1}, {statut: 0})
                            .then(udpated => {
                                Commentaire.findById(req.body.id)
                                .then(newComment => {
                                    res.status(200).json({newComment})
                                })
                            })
                            .catch(error => {
                                console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                                res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                            })
                        }
                    })
                    .catch(error => {
                        console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                        res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                    })
                }
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
            })
        }catch (error) {
            res.status(500).json({msg:"Mot de passe ou email incorrect.", error: error.message})
        }
    }

    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof commentaireContoller
     */
    static async getAllInfoComment(req, res){

        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."})
                }else{
                    Commentaire.findById(req.params.id)
                    .populate({
                        path:"exposition",
                        populate:{
                            path: "user_id"
                        }
                    })
                    .then(coment =>{
                        Commentaire.findById(req.params.id)
                        .populate("commentateur")
                        .then(commentAndUser => {
                            res.status(200).json({msg: "find", data: [coment, commentAndUser]})
                        })
                        .catch(error => {
                            console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                            res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                        })
                    })
                    .catch(error => {
                        console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                        res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
                    })
                }
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la sélection des commentaires.", error);
                res.status(400).json({msg: "Mot de passe ou email incorrect.", error: error.message})
            })
        }catch (error) {
            console.log("Mot de passe ou email incorrect.", error);
            res.status(500).json({msg:"Mot de passe ou email incorrect.", error: error.message})
        }
    }
}

module.exports = commentaireContoller;