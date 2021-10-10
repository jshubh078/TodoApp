module.exports = (app, express) => {

    const router = express.Router();

    const Globals = require("../../../configs/Globals");
    const Controller = require('./Controller');
    const config = require('../../../configs/configs');
    const Validators = require("./Validator");

    router.post('/category/list', Globals.isAuthorized, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.listCategory();
    });

    router.post('/category/add', Globals.isAuthorized, Validators.categoryValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.addCategory();
    });

    router.get('/category/getEdit/:id', Globals.isAuthorized, Validators.categoryGetValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.getEdit();
    });

    router.post('/category/update', Globals.isAuthorized, Validators.categoryUpdateValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.updateCategory();
    });


    router.post('/category/delete', Globals.isAuthorized, Validators.categoryGetValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.deleteCategory();
    });

    app.use(config.baseApiUrl, router);
}