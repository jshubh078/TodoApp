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

    router.post('/users/socialRegister', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.socialRegister();
    });


    app.use(config.baseApiUrl, router);
}