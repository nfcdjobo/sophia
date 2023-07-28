const Domaine = require('../models/domaineModel');
const bcrypt = require(`bcrypt`);
const User = require('../models/userModel');
const { findOne } = require('../models/domaineModel');


/**
 * @class DomaineController
 */
class DomaineController{
    /**
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof DomaineController
     */
    static async create(req, res){
        try {
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                console.log(req.body);
                if(!auth){
                    // console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                }else{
                    console.log(req.body, 23);
                    Domaine.findOne({libelle: req.body.libelle})
                    .then(domaine=>{
                        if(domaine){
                            // console.log("Cet domaine existe déjà"); 
                            return res.status(201).json({msg: "Cet domaine existe déjà."})
                        }
                        else{
                            if(req.file){req.body.photo=`${req.protocol}://${req.get('host')}/${req.file.path}`};
                            const newDomaine = new Domaine({... req.body, createdAt: new Date(), updatedAt: new Date()});
                            newDomaine.save()
                            .then(domaines=>{
                                // console.log(domaines)
                                return res.status(200).json({msg: "Domaine ajoute avec succès", data: domaines});
                            })
                            .catch(error=>{
                                // console.log("error survenue lors de l'enregistrement du domaine", error.message);
                                res.status(400).json({msg:"Erreur survenue lors de l'enregistrement du domaines, veuillez donc réessayer plus tard", error: error.message});
                            })
                        }
                    })
                    .catch(error=>{
                        // console.log("error survenue lors du traitement de la réquette", error.message);
                        res.status(400).json({msg:"Erreur survenue lors du traitement de la réquette, veuillez donc réessayer plus tard", error: error.message})
                    })
                }
            })
            .catch(error => {
                // console.log("Une érreur est survenue lors de la mise à jour.");
                res.status(400).json({msg: "Une érreur est survenue lors de la mise à jour.", error: error.message})
            })
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors de l'enregistrememnt", error: error.message})
        }
    }

    static async find_all(req, res){
        try {
            Domaine.find({})
            .then(domaine => {
                res.status(200).json({msg: domaine.length==0 ? `Aucun domaine n'a été trouvé !` : (domaine.length==1 ? `${domaine.length} seul domaine a été trouvé !` : `${domaine.length} domaine ont été trouvés !`), data: domaine})
            })
            .catch(error => {
                // console.log("error survenue lors de l'enregistrement du domaine", error.message);
                res.status(400).json({msg:"Une érreur est survenue lors de de la récupération des domaines, veuillez donc réessayer plus tard", error: error.message});
            })
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors du traitememnt de la requête, veuillez donc réessayer plus tard !", error: error.message})
        }
    }

    static async getByLibelle(req, res){
        try {
            Domaine.findOne({libelle: req.params.libelle})
            .then(domaine => {
                res.status(200).json({msg: "Il domaine est trouvé.", data: domaine});
            })
            .catch(error => {
                // console.log(error)
                res.status(400).json({msg: "Erreur survenue lors du traitemement", error: error});
            })
        } catch (error) {
            res.status(500).json({msg:"Une erreur est survenue lors du traitememnt de la requête, veuillez donc réessayer plus tard !", error: error.message})
        }
    }

    /**
     *
     *
     * @static
     * @param {Request} req
     * @param {Response} res
     * @memberof DomaineController
     */
    static async getDomaineById(req, res){
        try {
            User.findOne({_id:req.auth.user_id, email: req.auth.user_email})
            .then(auth => {
                if(!auth){
                    /*console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");*/
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                }else{
                    Domaine.findById(req.params.id)
                    .then(domaine => {
                        /*console.log("Réquête examinée avec succès.");*/
                        res.status(200).json({msg: "Réquête examinée avec succès.", data:domaine});
                    })
                    .catch(error => {
                        console.log("Réquête non prise en compte.", error);
                        res.status(500).json({msg: "Réquête non prise en compte.", error:error.message});
                    })
                }
            })
            .catch(error => {
                console.log("Vous n'êtes pas autorisé à effectuer cette réquête.", error);
                res.status(500).json({msg: "Vous n'êtes pas autorisé à effectuer cette réquête.", error: error.message});
            })
        }catch (error) {
            console.log("Une erreur est survenue", error);
            res.status(500).json({msg: "Vous n'êtes pas autorisé à effectuer cette réquête.", error: error.message});
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
                if (!auth) {
                    console.log("Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier.");
                    res.status(400).json({msg: "Vous n'êtes pas autorisé à effectuer cette requête, chercher à vous authentifier."});
                } else {
                    if(req.file){req.body.photo=`${req.protocol}://${req.get('host')}/${req.file.path}`};
                    Domaine.findById(req.body.id)
                    .then(domaine => {
                        if (domaine) {
                            console.log("Mise à jour effectuée avec succès !", req.body.id===domaine._id);
                            delete req.body.id;
                            Domaine.updateOne({_id: domaine._id}, {
                                ...req.body,
                                updatedAt: new Date()
                            })
                            .then(updated => {
                                console.log("Mise à jour effectuée avec succès !", updated);
                                Domaine.findById(domaine._id)
                                .then(newDomaine => {
                                    res.status(201).json({ msg: "Mise à jour effectuée avec succès !", data: newDomaine });
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

module.exports = DomaineController;