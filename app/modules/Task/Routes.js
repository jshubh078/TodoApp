module.exports = (app, express) => {

    const router = express.Router();

    const Globals = require("../../../configs/Globals");
    const Controller = require('./Controller');
    const config = require('../../../configs/configs');
    const Validators = require("./Validator");



    router.post('/task/addTask', Globals.isAuthorized, Validators.taskValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.addTask();
    });

    router.get('/task/getTask/:id', Globals.isAuthorized, Validators.taskGetValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.getEdit();
    });

    router.post('/task/updateTask', Globals.isAuthorized, Validators.taskUpdateValidator(), Validators.validateBody, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.updateTask();
    });


    router.post('/task/deleteTask', Globals.isAuthorized, (req, res, next) => {
        const obj = (new Controller()).boot(req, res);
        return obj.deleteTask();
    });

    app.use(config.baseApiUrl, router);
}