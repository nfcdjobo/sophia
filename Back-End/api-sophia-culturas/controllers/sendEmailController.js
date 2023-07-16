const nodemailer = require('nodemailer');
const htmlFormatage = require('../Formatage/templateEmail')
const genererChaineAleatoire = require('../Formatage/Aleatore');

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
            })
            res.status(200).json({ msg:"Email envoyé avec succès", data: {info: information, url: nodemailer.getTestMessageUrl(information)}, code:contenu.code });
        } catch (error) {
            console.log(error) 
        }
    }
}

module.exports = {SendEmailController, genererChaineAleatoire};

