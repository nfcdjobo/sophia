const { static } = require("express");
const Exposition = require("../models/expositionModel");
const Like = require("../models/lileModel");
const User = require("../models/userModel");
const Commentaire = require("../models/commentaireModel")

class LikeController{
    /**
     *
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof likeController
     */
    static async create(req, res){
        try {
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                }else{
                    Like.find({exposition: [req.body.exposition]})
                    .then(lik => {
                        if(lik.length > 0){
                            if(lik.every(item => item.commentateur[0] != req.auth.user_id)){
                                const likk = new Like({...req.body});
                                likk.save()
                                .then(ok => {
                                    console.log('OK, OK')
                                    res.status(200).json({msg: "Vous avez aimé", data: ok});
                                })
                                .catch(error => {
                                    console.log("Error produite", error);
                                    res.status(401).json({msg: "Une erreur s'est produite", error: error.message});
                                })
                            }else{
                                res.status(201).json({msg: "Vous avez déjà aimé"});
                            }
                        }else{
                            new Like({...req.body}).save()
                            .then(ok => {
                                res.status(200).json({msg: "Vous avez aimé", data: ok});
                            })
                            .catch(error => {
                                console.log("Error produite", error)
                                res.status(401).json({msg: "Une erreur s'est produite", error: error.message});
                            })
                        }
                    })
                    .catch(error => {
                        console.log("Error produite", error)
                        res.status(401).json({msg: "Une erreur s'est produite", error: error.message});
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
     * @memberof likeController
     */
    static  async getLikeByCommentateur(req, res){
        try{
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if (!auth) {
                    console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                } else {
                    Like.find({commentateur: [req.params.commentateur]})
                    .populate(
                        {
                            path:"exposition",
                            populate:{
                                path: "user_id"
                            }
                        }
                    )
                    .then(succes => {

                        Commentaire.find({commentateur: [req.params.commentateur]})
                        .populate({
                            path:"exposition",
                            populate:{
                                path: "user_id"
                            }
                        })
                        .then(commentBy => {
                            res.status(200).json({msg: "Requête réussie", data : succes, comment: commentBy})
                        })
                    })
                    .catch(error => {
                        console.log("Une érreur est survenue lors de la sélection.", error);
                        res.status(400).json({msg: "Aucune donnée n'est trouvée.", error: error.message})
                    })
                }
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la sélection.", error);
                res.status(400).json({msg: "Aucune donnée n'est trouvée.", error: error.message})
            })
        }catch (error) {
            console.log("Une érreur est survenue lors de la sélection.", error);
            res.status(500).json({msg:"Aucune donnée n'est trouvée.", error: error.message})
        }
    }
}

module.exports = LikeController;