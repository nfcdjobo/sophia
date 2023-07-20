const Ajouter = require("../function/Ajouter");
const Recuperer = require("../function/Recuperer");
const Modifier = require("../function/Modifier");
const User = require('../models/userModel');

class RaccourirController{
    /**
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof RaccourirController
     */
    static async create(req, res){
        if(req.file){req.body.photo = req.protocol+"://"+req.get('host')+"/"+req.file.path};
        Ajouter(User, req, res);
    }

    /**
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof RaccourirController
     */
    static  async getAll(req, res){
        Recuperer(req, res);
    }

    /**
     * @static
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @memberof RaccourirController
     */
    static async update(req, res){
        if(req.file){req.body.photo = req.protocol+"://"+req.get('host')+"/"+req.file.path};
        Modifier(User, req, res)
    }
}

module.exports = RaccourirController;
