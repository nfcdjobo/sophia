const jwt = require('jsonwebtoken');
const PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS = require('../private/PrivateKey');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let token_decoded = jwt.verify(token, PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS);
        const user_id =  token_decoded.user_id;
        const user_email = token_decoded.user_email;
        const user_domaine = token_decoded.user_domaine;
        const domaine = token_decoded.domaine;
        req.auth = {user_id: user_id, user_email: user_email, user_domaine: user_domaine, domaine: domaine};
        next();
    } catch (error) {
        console.log("Vous n'êtes pas autorisé.",error.message);
        res.status(404).json({msg: "Vous n'êtes pas autorisé.", error: error.message})
    }
}