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
const RaccourirController = require('../controllers/RaccourirController');
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
Router.get('/getExpositionById/:id', Auth, ExpositionController.getById);
Router.get('/getAllExposition', ExpositionController.getAll);
Router.post('/updateExposition', Auth, Telecharger, ExpositionController.uptate);

Router.post('/createComment', Auth, commentaireContoller.create);
Router.get('/getAllComment', Auth, commentaireContoller.getAllComment);
//Router.get('/getCommentById/:id', Auth, commentaireContoller.getById);
Router.get('/getCommentByAutor', Auth, commentaireContoller.getCommentByAutor);
Router.get('/getCommentJoint', Auth, commentaireContoller.getCommentJoint);
Router.get('/getCommentLireJoint', Auth, commentaireContoller.getCommentLireJoint);
Router.post('/updateCommantaire', Auth, commentaireContoller.update);
Router.get('/getAllInfoComment/:id', Auth, commentaireContoller.getAllInfoComment);

Router.post('/create', Telecharger, Auth,  RaccourirController.create);
Router.post('/update', Auth, Telecharger, RaccourirController.update);
Router.get('/getAll/:entite', RaccourirController.getAll);

Router.post('/sendMessage', SendEmailController.sendMessage);
Router.post('/updateMessage', Auth, SendEmailController.updateMessage);
Router.get('/getMessageRead', Auth, SendEmailController.getMessageRead);
Router.get('/getMessageNoRead', Auth, SendEmailController.getMessageNoRead);
Router.post('/testEmail', SendEmailController.testEmail);



Router.post('/createLike', Auth, LikeController.create);
Router.get('/getLikeByCommentateur/:commentateur', Auth, LikeController.getLikeByCommentateur);

Router.post('/login', LoginController.login);
Router.post('/reset', LoginController.reset);



module.exports = Router;