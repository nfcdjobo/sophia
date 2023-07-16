const jwt = require('jsonwebtoken');
const PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS = require('../private/PrivateKey');

const generateToken = (userData) => jwt.sign( userData, PRIMATE_KEY_TOKEN_SOPHIA_CULTURAS, {expiresIn: 24*60*60} , process.env.JWT_TOKEN_SECRET);

module.exports = generateToken;
