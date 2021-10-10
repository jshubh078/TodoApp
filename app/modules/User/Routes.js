module.exports = (app, express) => {

    const router = express.Router();

    const Globals = require("../../../configs/Globals");
    const UsersController = require('../User/Controller');
    const config = require('../../../configs/configs');
    const Validators = require("./Validator");

    router.post('/users/register', Validators.signupValidator(), Validators.validateBody, (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.register();
    });

    router.post('/users/login', Validators.loginValidator(), Validators.validateBody, (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.login();
    });


    // router.get('/users/profile', Globals.isAuthorized, (req, res, next) => {
    //     const userObj = (new UsersController()).boot(req, res);
    //     return userObj.userProfile();
    // });


    // router.post('/users/socialAccess', Validators.socialAccessValidator(), Validators.validate, (req, res, next) => {
    //     const userObj = (new UsersController()).boot(req, res);
    //     return userObj.socialAccess();
    // });

    // router.post('/users/checkSocial', (req, res, next) => {
    //     const userObj = (new UsersController()).boot(req, res);
    //     return userObj.checkSocial();
    // });

    app.use(config.baseApiUrl, router);
}