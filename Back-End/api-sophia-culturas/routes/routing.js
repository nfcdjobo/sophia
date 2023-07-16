const express = require('express');
const cookieParser = require('cookie-parser');
const DomaineController = require('../controllers/domaineController');
const Router = express.Router();
const IndexController = require('../controllers/IndexController');
const {SendEmailController, genererChaineAleatoire} = require('../controllers/sendEmailController');
const UserController = require('../controllers/userController');
const LoginController = require('../controllers/LoginController');
const ExpositionController = require('../controllers/ExpositionController');
const LikeController = require('../controllers/LikeController');
const commentaireContoller = require('../controllers/commentaireControlloer');

const Auth = require("../middlewares/Auth");
const Telecharger = require("../middlewares/upload");

Router.use(cookieParser())

Router.get('/', IndexController.index);

Router.post('/sendEmail', SendEmailController.verifyEmail);

Router.post("/createDomaine", Auth, Telecharger, DomaineController.create);
Router.get('/getAllDomaine', DomaineController.find_all);
Router.get('/getDomaineByLibelle/:libelle', DomaineController.getByLibelle);
Router.get('/getDomaineById/:id', Auth, DomaineController.getDomaineById);
Router.post('/uptateDomaine', Auth, Telecharger, DomaineController.uptate)

Router.post('/createUser', Telecharger, UserController.create);
Router.get('/getAllUsers', Auth, UserController.getAll);
Router.get("/getUserById/:id", Auth, UserController.getById);
Router.post("/updateUser", Auth, Telecharger, UserController.update);
// Router.get("/getAllAuteur", Auth, UserController.getAllAuteur);
// Router.get("/getAllAbonnes", Auth, UserController.getAllAbonnes);

Router.post('/createExposition', Auth, Telecharger, ExpositionController.create);
Router.get('/getExpositionByAutor/:user_id', ExpositionController.getExpositionByAutor);
Router.get('/getByIdExposition/:id', Auth, ExpositionController.getById);
Router.get('/getAllExposition', ExpositionController.getAll);
Router.post('/updateExposition', Auth, Telecharger, ExpositionController.uptate);

Router.post('/createComment', Auth, commentaireContoller.create);

Router.post('/createLike', Auth, LikeController.create);

Router.post('/login', LoginController.login);



module.exports = Router;