const Domaine = require('../models/domaineModel');
const User = require('../models/userModel');
const bcrypt = require(`bcrypt`);
const generateToken = require('../middlewares/systemeToken');
const fs = require("fs");


/**
 * @class UserController
 */
class UserController{
    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    static async create(req, res){
        try {
            User.findOne({email: req.body.email})
            .then(user=>{
                if(user) return res.status(201).json({msg: "Cet utilisater existe déjà"});
                else{
                    bcrypt.hash(req.body.password, 10)
                    .then(hash=>{
                        req.body.password = hash;
                        if(req.file){req.body.photo = req.protocol+"://"+req.get('host')+"/"+req.file.path};
                        const newUser = new User({... req.body, createdAt: new Date(), updatedAt: new Date()});
                        newUser.save()
                        .then(users=>{
                            return res.status(200).json({msg: "Utilisateur ajoute avec succès", data: users});
                        })
                        .catch(error=>{
                            console.log("error survenue lors de l'enregistrement d'utilisateur", error.message);
                            res.status(400).json({msg:"Erreur survenue lors de l'enregistrement d'utilisateur, veuillez donc réessayer plus tard", error: error.message});
                        })

                    })
                    .catch(error=>{
                        console.log("error survenue lors du cryptage du mot de passe de l'utilisateur", error.message);
                        res.status(400).json({msg:"Erreur survenue lors du cryptage du mot de passe de l'utilisateur, veuillez donc réessayer plus tard", error: error.message})
                    })
                }
            })
            .catch(error=>{
                console.log("error survenue lors du traitement de la réquette", error.message);
                res.status(400).json({msg:"Erreur survenue lors du traitement de la réquette, veuillez donc réessayer plus tard", error: error.message})
            })
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors de l'enregistrememnt", error: error.message})
        }
    }


    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    static async getAll(req, res){
        try {
            User.findOne({ _id: req.auth.user_id, email: req.auth.user_email })
            .then(us => {
                if(us){
                    User.find({})
                    .then(users => {
                        res.status(200).json({data: users})
                    })
                    .catch(error => {
                        res.status(401).json({msg: "Email/ mot de passe incorrect", error: error})
                    })
                }else{
                    res.status(401).json({msg: "Email/ mot de passe incorrect" })
                }
            })
            .catch(error => {
                res.status(401).json({msg: "Email/ mot de passe incorrect", error: error})
            })
            
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors de l'enregistrememnt", error: error.message})
        }
    }


    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    static async update(req, res){
        User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
        .then(auth => {
            if(!auth){console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."); res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."}); return};
            
            // if(req.file){req.body.photo=`${req.protocol}://${req.get('host')}/${req.file.path}`};
            delete req.body.id;
            console.log(auth.photo);
            const ancienFichier = auth.photo.split("/stockage\\")[1];;
            if(req.file){req.body.photo = req.protocol+"://"+req.get('host')+"/"+req.file.path};
            User.updateOne({_id:req.auth.user_id, email: req.auth.user_email}, {... req.body, updatedAt: new Date()})
            .then(upd => {
                User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
                .then(user => {
                    Domaine.findById(user.domaine_id[0])
                    .then(domaine => {
                        req.auth = {
                            user_id:user._id,
                            user_email: user.email,
                            user_domaine: user.domaine_id[0],
                            domaine: domaine.libelle
                        };
                        const token = generateToken(req.auth);
                        console.log("Mise à jour effectuée avec succès !");
                        res.status(200).json({msg: "Mise à jour effectuée avec succès !", token: token, user: user, domaine: domaine});
                    })
                    .catch(error => {
                        console.log("Mise à jour effectuée avec succès, mais une érreur est survenue.", error);
                        res.status(400).json({msg: "Mise à jour effectuée avec succès, mais une érreur est survenue.", error: error.message})
                    })
                })
                .catch(error => {
                    console.log("Mise à jour avortée.");
                    res.status(400).json({msg: "Mise à jour avortée", error: error.message})
                });
            })
            .catch(error => {
                console.log("Une érreur est survenue lors de la mise à jour.UUU", error);
                res.status(400).json({msg: "Une érreur est survenue lors de la mise à jour.", error: error.message})
            });
        })
        .catch(error => {
            console.log("Une érreur est survenue lors de la mise à jour.");
            res.status(400).json({msg: "Une érreur est survenue lors de la mise à jour.", error: error.message})
        })
    }

    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    static async getById(req, res){
        User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
        .then(user => {
            if(!user){
                console.log("Vous ne pouvez pas avoir accès aux réssources de cette page, chercher à vous authentifier");
                res.status(500).json({msg: "Vous ne pouvez pas avoir accès aux réssources de cette page, chercher à vous authentifier"})
            }else{
                User.findById(req.params.id)
                .then(auteur => {
                    if(auteur){
                        console.log("Requête prise en compte.");
                        res.status(200).json({auteur: auteur})
                    }else{
                        res.status(201).json({msg: "Cette exposition n'a pas d'auteur."})
                    }
                })
            }
        })
    }
}

module.exports = UserController;