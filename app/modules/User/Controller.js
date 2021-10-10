const _ = require("lodash");

const Controller = require("../Base/Controller");
const Users = require('./Schema').Users;
const Globals = require("../../../configs/Globals");
const Config = require("../../../configs/configs");
const RequestBody = require("../../services/RequestBody");
const CommonService = require("../../services/Common");
const exportLib = require('../../../lib/Exports');


class UsersController extends Controller {
    constructor() {
            super();
        }
        /********************************************************
     Purpose: user register
        Parameter:
            {
                "emailId":"john@doe.com",
                "password":"john",
                "firstName":"shubh",
                "lastName":"jain"
            }
    Return: JSON String
   ********************************************************/
    async register() {
        try {
            let fieldsArray = ["emailId", "firstName", "lastName", "password"];
            if (_.isEmpty(this.req.body.emailId)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'UNPROCESSABLE_ENTITY', message: exportLib.ResponseEn.EMAIL_ID });
            }
            if (_.isEmpty(this.req.body.firstName)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'UNPROCESSABLE_ENTITY', message: exportLib.ResponseEn.NAME });
            }
            // check emailId is exist or not
            let email = this.req.body.emailId
            let filters = { "emailId": email.toLowerCase() }
            const checkEmailId = await Users.findOne({ where: filters });

            if (checkEmailId) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.DUPLICATE_EMAIL });
            } else {

                let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

                let isPasswordValid = await (new CommonService()).validatePassword({ password: data['password'] });
                if (isPasswordValid && !isPasswordValid.status) {
                    return exportLib.Response.handleResponse(this.res, { status: false, code: 'UNPROCESSABLE_ENTITY', messageEn: isPasswordValid.messageEn, messageAr: isPasswordValid.messageAr, data: {} });
                }
                let password = await (new CommonService()).ecryptPassword({ password: data['password'] });
                data = {...data, password: password };
                data['emailId'] = data['emailId'].toLowerCase();
                // save new user

                const newUserId = await Users.create(data);
                let setObject = {
                    "userId": newUserId.id,
                    "emailId": newUserId.emailId,
                    "firstName": newUserId.firstName,
                    "lastName": newUserId.lastName,
                }
                exportLib.Response.handleResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.REGISTRATION_SCUCCESS, data: setObject });

            }


        } catch (error) {
            console.log("error = ", error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: typeof error == 'string' ? error : 'INTERNAL_SERVER_ERROR' });
        }
    }




    /********************************************************
    Purpose: Login
    Parameter:
        {
            "emailId":"john@doe.com"
            "password":"123456",
        }
    Return: JSON String
   ********************************************************/
    async login() {
        try {
            if (_.isEmpty(this.req.body.emailId)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'UNPROCESSABLE_ENTITY', message: exportLib.ResponseEn.EMAILIDORMOBILE });
            }
            if (_.isEmpty(this.req.body.password)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'UNPROCESSABLE_ENTITY', message: exportLib.ResponseEn.PASSWORD });
            }

            let data = await (new RequestBody()).processRequestBody(this.req.body, ["deviceToken", "deviceType"]);

            let query = {

                emailId: this.req.body.emailId

            }


            let user = await Users.findOne({ where: query });
            if (_.isEmpty(user)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'NOT_FOUND', message: exportLib.ResponseEn.USER_NOT_EXIST });
            } else {
                let status = await (new CommonService()).verifyPassword({ password: this.req.body.password, savedPassword: user.password });

                //this condition for password verify for database
                if (status == false) {
                    return exportLib.Error.handleError(this.res, { status: false, code: 'NOT_ACCEPTABLE', message: exportLib.ResponseEn.INVALID_PASSWORD });
                }
                //check this condition for admin delete the account for customer                

                data['lastSeen'] = new Date();
                await Users.update(data, { where: { id: user.id } })

                let token = await new Globals().getToken({ id: user.id });
                let setObject = {
                    userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }

                return exportLib.Response.handleResponse(this.res, { status: true, code: 'OK', message: exportLib.ResponseEn.LOGIN_SUCCESS, data: setObject }, token);


            }

        } catch (error) {
            console.log(error, 'error in login')
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });

        }
    }
}
module.exports = UsersController;