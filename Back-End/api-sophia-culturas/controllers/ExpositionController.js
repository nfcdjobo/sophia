const Exposition = require("../models/expositionModel");
const User = require("../models/userModel");
const Domaine = require("../models/domaineModel");
const Like = require("../models/lileModel");
const Commentaire = require("../models/commentaireModel");

class ExpositionController{
    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof ExpositionController
     */
    static async create(req, res){
        try {
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then((result) => {
                if(!result) {console.log("Vous n'avez pas l'autorisationd'effectuer cette requête"); res.status(203).json({msg: "Vous n'avez pas l'autorisation d'effectuer cette requête"})}
                else{
                    Exposition.findOne({titre: req.body.titre})
                    .then((expo) => {
                        // console.log(expo.titre==req.body.titre, expo.user_id[0]==result._id)
                        if(expo && expo.user_id[0]===result._id){
                            console.log("Vous avez déjà ajouté cette exposition, ajoutez-en une autre");
                            res.status(202).json({msg: "Vous avez déjà ajouté cette exposition, ajoutez-en une autre"});
                        }else {
                            if(req.file){req.body.photo=`${req.protocol}://${req.get('host')}/${req.file.path}`};
                            const newExposition =new Exposition({ ... req.body, createdAt: new Date(), updatedAt: new Date() });
                            newExposition.save()
                            .then((result) => {
                                console.log("Exposition enregistréeavec succès", result);
                                res.status(200).json({msg: "Exposition enregistréeavec succès", data: result});
                            }).catch((error) => {
                                console.log("Une érreur est survenue lors de l'enregistrement ! error1", error.message);
                                res.status(401).json({msg:"Une érreur est survenue lors de l'enregistrement !", error: error.message});
                            });
                        }
                    }).catch((error) => {
                        console.log("Une erreur s'est produite lors du traîtememnt de la requêt, veuillez donc réessayer ! error2", error);
                        res.status(501).json({msg:"Une erreur s'est produite lors du traîtememnt de la requêt, veuillez donc réessayer !", error: error.message});
                    });
                }
            }).catch((error) => {
                console.log("Une érreur est survenue lors de l'enregistrement ! error3", error.message);
                res.status(401).json({msg:"Une érreur est survenue lors de l'enregistrement", error: error.message});
            });
        } catch (error) {
            console.log("Une erreur s'est produite lors du traîtememnt de la requêt, veuillez donc réessayer ! error4", error.message);
            res.status(501).json({msg:"Une erreur s'est produite lors du traîtememnt de la requêt, veuillez donc réessayer !", error: error.message});
        }
    }

    static async getById(req, res){
        User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
        .then((user) => {
            if(!user){
                console.log("Vous n'avez pas l'autorisationd'effectuer cette requête");
                res.status(400).json({msg: "Vous n'avez pas l'autorisationd'effectuer cette requête"})
                
            }else{
                Exposition.findById(req.params.id)
                .then(exposition => {
                    if(!exposition){console.log("Cette expostion a été supprimée"); res.status(400).json({msg: "Cette expostion a été supprimée"}); return}
                    else{
                        res.status(200).json({msg:"L'exposition a bien été trouvée.", data: exposition})
                    }
                })
                .catch((error) => {
                    console.log("Cette exposition n'existe pas:", error.message)
                    res.status(500).json({msg:"Cette exposition n'existe pas:", error: error})
                });
            }
        }).catch((error) => {
            console.log("Une erreur est survenue lors du traitememnt de la requête Exposition Controller ERROR 2", error.message)
            res.status(500).json({msg:"Une erreur est survenue lors du traitememnt de la requête", error: error.message})
        });
    }


    static async getExpositionByAutor(req, res){
        console.log('cookie.user._id', req.params.user_id)
        Exposition.find({user_id: [req.params.user_id]})
        .then(response => {
            Commentaire.find({})
            .then(comment => {
                Like.find({})
                .then(like => {
                    res.status(200).json({msg: response.length==0 ? "Aucune exposition n'a été trouvée" : response.length == 1 ? `${response.length}  exposition a été trouvée` : `${response.length} expositions ont été trouvées`, data: response, comment:comment, like: like})
                })
                .catch(error => {
                    console.log("L'url invalide, veuillez donc réessayer avc le bon url !", error);
                    res.status(401).json({msg: "Mot de passe ou email incorrect !", error: error.message})
                })
            })
            .catch(error => {
                console.log("L'url invalide, veuillez donc réessayer avc le bon url !", error);
                res.status(401).json({msg: "Mot de passe ou email incorrect !", error: error.message})
            })
        })
        .catch(error => {
            console.log("L'url invalide, veuillez donc réessayer avc le bon url !", error);
            res.status(401).json({msg: "L'url invalide, veuillez donc réessayer avc le bon url !", error: error.message})
        })
        
    }

    static async getAll(req, res){
        try{
            Exposition.find({})
            .populate('user_id')
            .then(response => {
                Commentaire.find({})
                .then(comment => {
                    Like.find({})
                    .then(like => {
                        console.log(response.length + "Exposition(s) trouvée(s).")
                        res.status(200).json({msg: response.length==0 ? "Aucune exposition n'a été trouvée" : response.length == 1 ? `${response.length} exposition a été trouvée` : `${response.length} expositions ont été trouvées`, data: response, comment: comment, like: like});
                    })
                })
            })
            .catch(error => {
                console.log("L'url invalide, veuillez donc réessayer avc le bon url !", error.message);
                res.status(401).json({msg: "L'url invalide, veuillez donc réessayer avc le bon url !"});
            })
        }catch (error) {
            console.log("L'url invalide, veuillez donc réessayer avc le bon url !", error.message);
            res.status(401).json({msg: "L'url invalide, veuillez donc réessayer avc le bon url !"});
        }

    }

    /**
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof DomaineController
     */
    static async uptate(req, res) {
        try {
            User.findOne({_id: req.auth.user_id, email: req.auth.user_email})
                .then(auth => {
                    console.log("req.body", req.body)
                    if (!auth) {
                        console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                        res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                    } else {
                        if(req.file){req.body.photo=`${req.protocol}://${req.get('host')}/${req.file.path}`};
                        Exposition.findById(req.body.id)
                            .then(exposition => {
                                if (exposition) {
                                    delete req.body.id;
                                    Exposition.updateOne({_id: exposition._id}, {
                                        ...req.body,
                                        updatedAt: new Date()
                                    })
                                        .then(updated => {
                                            Exposition.findById(exposition._id)
                                                .then(newExposition => {
                                                    res.status(201).json({ msg: "Mise à jour effectuée avec succès !", data: newExposition });
                                                })
                                                .catch(error => {
                                                    console.log("Nouvelle mise à jour non ciblée.", error);
                                                    res.status(201).json({ msg: "Nouvelle mise à jour non ciblée.", error: error.message })
                                                })
                                        })
                                        .catch(error => {
                                            console.log("Mise à jour non prise en compte.", error);
                                            res.status(201).json({
                                                msg: "Mise à jour non prise en compte.",
                                                error: error.message
                                            })
                                        })
                                } else {
                                    console.log("Mise à jour non prise en compte.");
                                    res.status(201).json({msg: "Mise à jour non prise en compte."})
                                }
                            })
                            .catch(error => {
                                console.log("Mise à jour non prise en compte.", error);
                                res.status(201).json({msg: "Mise à jour non prise en compte.", error: error.message})
                            })
                    }
                })
                .catch(error => {
                    console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.", error);
                    res.status(500).json({
                        msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.",
                        error: error.message
                    });
                })
        }catch(error){
            console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.", error);
            res.status(500).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.", error: error.message});
        }
    }
}

module.exports = ExpositionController;