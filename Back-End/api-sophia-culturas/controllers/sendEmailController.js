const nodemailer = require('nodemailer');
const htmlFormatage = require('../Formatage/templateEmail')
const genererChaineAleatoire = require('../Formatage/Aleatore');
const Messagerie = require('../models/messagerieModel')
const User = require("../models/userModel");

const contenu = {
    header: "Action requise&nbsp;: code de vérification à usage unique",
    raison: "Vous recevez cet e-mail car une demande d'inscription a été faite pour un code à usage unique qui peut être utilisé pour la création du compte.",
    instruction: "Veuillez saisir le code suivant pour confirmer&nbsp;:",
    code: genererChaineAleatoire(5),
    end: "Ce message a été envoyé par ",
    plateforme: 'Sophia-Culturas'
};

const transporteur = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: 'wava.quitzon@ethereal.email',
        pass: '9Z8vkgMTDgS6JbY7Nc'
    }
});


class SendEmailController{
    
    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */
    static async verifyEmail(req, res){
        try {
            const information = await transporteur.sendMail({
                from: '"Sophia-Culturas" <sophia-culturas@gmail.com>',
                to: req.body.email,
                subject: "Code de vérification à usage unique",
                html: htmlFormatage(contenu)
            });
            res.status(200).json({ msg:"Email envoyé avec succès", data: {info: information, url: nodemailer.getTestMessageUrl(information)}, code:contenu.code });
        } catch (error) {
            console.log(error) ;
            res.status(500).json({msg: "Message non envoyé !", error: error.message});
        }
    }

    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */
    static  async sendMessage(req, res){
        try {
            const messagerie = new Messagerie({... req.body});
            messagerie.save()
                .then(message=>{
                    console.log("Message envoyé !");
                    res.status(201).json({msg:"Message envoyé avec succès.", data: message});
                })
                .catch(error=>{
                    console.log("Message non envoyé !", error);
                    res.status(201).json({msg:"Message non envoyé!", error: error.message});
                })
        }catch (error) {
            res.status(500).json({msg: "Message non envoyé !", error: error.message});
        }
    }

    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */
    static async getMessageNoRead(req, res){
        try {
            User.findOne({_id: req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if (!auth) {
                    console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                } else {
                    Messagerie.find({statut: 1})
                    .then(message=>{
                        res.status(200).json({msg: "Lecture effectuée avec succès !", data: message})
                    })
                    .catch(error => {
                        console.log("Lecture annulée", error);
                        res.status(401).json({msg: "Mot de passe ou email incorrect !"});
                    })
                }
            })
            .catch(error => {
                console.log("Lecture annulée", error);
                res.status(401).json({msg: "Mot de passe ou email incorrect !"});
            })
        }catch (error) {
            console.log("Lecture annulée", error);
            res.status(500).json({msg: "Mot de passe ou email incorrect !"});
        }
    }

    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */
    static async getMessageRead(req, res){
        try {
            User.findOne({_id: req.auth.user_id, email: req.auth.user_email})
                .then(auth => {
                    if (!auth) {
                        console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                        res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                    } else {
                        Messagerie.find({statut: 0})
                        .then(message=>{
                            res.status(200).json({msg: "Lecture effectuée avec succès !", data: message})
                        })
                        .catch(error => {
                            console.log("Lecture annulée", error);
                            res.status(401).json({msg: "Mot de passe ou email incorrect !"});
                        })
                    }
                })
                .catch(error => {
                    console.log("Lecture annulée", error);
                    res.status(401).json({msg: "Mot de passe ou email incorrect !"});
                })
        }catch (error) {
            console.log("Lecture annulée", error);
            res.status(500).json({msg: "Mot de passe ou email incorrect !"});
        }
    }

    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */

    static async updateMessage(req, res){
        try {
            User.findOne({_id: req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if (!auth) {
                    console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                } else {
                    Messagerie.findById(req.body.id)
                    .then(messag=>{
                        if(!messag){
                            console.log("Ce message n'existe pas");
                            res.status(401).json({msg: "Mot de passe ou email incorrect !"})
                        }else {
                            Messagerie.updateOne({_id: messag._id, statut: 1}, {statut: 0, lecteur: req.auth.user_id, updatedAt: new Date()})
                            .then(updated => {
                                console.log("Mise à jour effectuée avec succès !");
                                res.status(201).json({msg:"Mise à jour effectuée avec succès !"});
                            })
                            .catch(error => {
                                console.log("Mise à jour annulée", error);
                                res.status(401).json({msg: "Mot de passe ou email incorrect !"});
                            })
                        }
                    })
                    .catch(error => {
                        console.log("Mise à jour annulée", error);
                        res.status(401).json({msg: "Mot de passe ou email incorrect !"});
                    })
                }
            })
            .catch(error => {
                console.log("Mise à jour annulée", error);
                res.status(401).json({msg: "Mot de passe ou email incorrect !"});
            })
        }catch (error) {
            console.log("Mise à jour annulée", error);
            res.status(500).json({msg: "Mot de passe ou email incorrect !"});
        }
    }

    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof SendEmailController
     */
    static async testEmail(req, res){
        try {
            console.log("req.body",req.body)
            User.findOne({email: req.body.email})
            .then( async user => {
                if(!user){
                    console.log("Compte introvable !")
                    res.status(501).json({msg: "Compte introvable !"});
                }else{
                    const information = await transporteur.sendMail({
                        from: '"Sophia-Culturas" <sophia-culturas@gmail.com>',
                        to: req.body.email,
                        subject: "Code de vérification à usage unique",
                        html: htmlFormatage(contenu)
                    });
                    res.status(200).json({ msg:"Mot de passe réenitialisé ave succès !", data: {info: information, url: nodemailer.getTestMessageUrl(information)}, code:contenu.code });
                }
            })
            .catch(error => {
                console.log("Erreur survenue lors du traitement.", error)
                res.status(401).json({msg: "Erreur survenue lors du traitement.", error: error.message})
            })
        }catch (error) {
            console.log("Compte introvable !")
            res.status(501).json({msg: "Compte introvable !"});
        }
    }

}

module.exports = {SendEmailController, genererChaineAleatoire};

