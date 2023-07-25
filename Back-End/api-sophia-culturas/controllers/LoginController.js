const User = require('../models/userModel');
const Domaine = require('../models/domaineModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { static } = require('express');
const PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS = require('../private/PrivateKey');

const htmlFormatage = require('../Formatage/templateEmail')

class LoginController{
    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof LoginController
     */
    static async login(req, res){
        try {
            User.findOne({email:req.body.email})
            .then(user => {
                if(!user){
                    console.log("L'adresse email est incorret !");
                    res.status(401).json({msg: "L'adresse email est incorret !"});
                } else{
                    bcrypt.compare(req.body.password, user.password)
                    .then(pass => {
                        if(!pass){ 
                            console.log("Mot de passe incorrect !");
                            res.status(204).json({msg: "Mot de passe incorrect !"});
                        }
                        else{
                            console.log(user)
                            Domaine.findById(user.domaine_id)
                            .then(domaine =>{
                                req.auth = {
                                    user_id:user._id,
                                    user_email: user.email,
                                    user_domaine: user.domaine_id[0],
                                    domaine: domaine.libelle
                                };
                                const  token = jwt.sign( req.auth, PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS, {expiresIn: '24h'} , process.env.JWT_TOKEN_SECRET);
                                res.status(200).json({msg: "Connextion établie avec succès !", token: token, user: user, domaine: domaine});
                            })
                            .catch(error => {
                                console.log("Mot de passe ou email incorrect !");
                                res.status(204).json({msg: "Mot de passe ou email incorrect !", error: error.message});
                            })
                            
                        }
                    })
                    .catch(error => {
                        console.log("Mot de passe incorrect !");
                        res.status(204).json({msg: "Mot de passe incorrect !", error: error.message});
                    })
                }
            })
            .catch(error => {
                console.log("Connexion échouée, réessayez plus tard !22");
                res.status(501).json({msg: "Connexion échouée, réessayez plus tard !", error: error.message});
            })
        } catch (error) {
            console.log("Connexion échouée, réessayez plus tard !12");
            res.status(501).json({msg: "Connexion échouée, réessayez plus tard !", error: error.message});
        }
    }

    static async reset(req, res){
        try {
            User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        User.updateOne({_id: user._id, email: user.email}, {password: hash, updatedAt: new Date()})
                        .then(updated => {
                            console.log("Votre mot de passe a bien été réenitialisé avec succès !");
                            res.status(202).json({msg: "Votre mot de passe a bien été réenitialisé avec succès !"});
                        })
                        .catch(error => {
                            console.log("Service momentanenent indisponible, veuillez donc réessayer plus tard !", 1);
                            res.status(501).json({msg: "Service momentanenent indisponible, veuillez donc réessayer plus tard !", error: error.message});
                        })
                    })
                    .catch(error => {
                        console.log("Service momentanenent indisponible, veuillez donc réessayer plus tard !", 2);
                        res.status(501).json({msg: "Service momentanenent indisponible, veuillez donc réessayer plus tard !", error: error.message});
                    })
                }else{
                    console.log("Service momentanenent indisponible, veuillez donc réessayer plus tard !", 3);
                    res.status(501).json({msg: "Service momentanenent indisponible, veuillez donc réessayer plus tard !", error: error.message});
                }
            })
            .catch(error => {
                console.log("Email incorrect");
                res.status(501).json({msg: "Email incorrect", error: error.message});
            })
        }catch (error) {
            console.log("Service momentanenent indisponible, veuillez donc réessayer plus tard !", 4);
            res.status(501).json({msg: "Service momentanenent indisponible, veuillez donc réessayer plus tard !", error: error.message});
        }
    }
}
module.exports = LoginController;