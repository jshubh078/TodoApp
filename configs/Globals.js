/****************************
 SECURITY TOKEN HANDLING
 ****************************/
const _ = require('lodash');
const Moment = require('moment');
let jwt = require('jsonwebtoken')
const config = require('./configs');
const Authentication = require('../app/modules/Authentication/Schema').Authtokens;
const Users = require('../app/modules/User/Schema').Users;
const Model = require('../app/modules/Base/Model');
const exportLib = require('../lib/Exports');

class Globals {
    // Generate Token
    getToken(params) {
        return new Promise(async(resolve, reject) => {
            try {
                // Generate Token
                let token = jwt.sign({
                    id: params.id,
                    algorithm: "HS256",
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.tokenExpiry)
                }, config.securityToken);

                params.token = token;
                params.userId = params.id;
                params.tokenExpiryTime = Moment().add(parseInt(config.tokenExpirationTime), 'minutes');
                delete params.id
                let updateUser = await Authentication.findOne({ where: { userId: params.userId } });
                if (_.isEmpty(updateUser)) {
                    await Authentication.create(params);
                } else {
                    await Authentication.update(params, { where: { userId: params.userId } });
                }
                return resolve(token);
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        });
    }

    // Validating Token
    static async isAuthorized(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) return exportLib.Error.handleError(res, { status: false, code: 'UNAUTHORIZED', message: exportLib.ResponseEn.TOKEN_WITH_API });


            const authenticate = new Globals();

            const tokenCheck = await authenticate.checkTokenInDB(token);
            if (!tokenCheck) return exportLib.Error.handleError(res, { status: false, code: 'UNAUTHORIZED', message: exportLib.ResponseEn.INVALID_TOKEN });


            const tokenExpire = await authenticate.checkExpiration(token);
            if (!tokenExpire) exportLib.Error.handleError(res, { status: false, code: 'UNAUTHORIZED', message: exportLib.ResponseEn.TOKEN_EXPIRED });

            const userExist = await authenticate.checkUserInDB(token);
            if (!userExist) return exportLib.Error.handleError(res, { status: false, code: 'NOT_FOUND', message: exportLib.ResponseEn.USER_NOT_EXIST });
            if (userExist.status == 'Inactive') return exportLib.Error.handleError(res, { status: false, code: 'NOT_FOUND', message: exportLib.ResponseEn.INACTIVE_ACCOUNT });

            req.currentUser = userExist

            next();
        } catch (err) {
            console.log("Token authentication", err);
            return res.send({ status: 0, message: err });
        }
    }
    async checkPasswordExpiryTime(data) {
            return new Promise(async(resolve, reject) => {
                try {
                    if (data && data.userObj && data.userObj.passwordUpdatedAt) {
                        let lastChangedDate = Moment(data.userObj.passwordUpdatedAt, 'YYYY-MM-DD HH:mm:ss');
                        let currentDate = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                        let duration = Moment.duration(currentDate.diff(lastChangedDate));
                        let months = duration.asMonths();
                        if (months >= parseInt(config.updatePasswordPeriod)) {
                            return resolve(true);
                        }
                        return resolve(false);
                    }
                    return resolve()
                } catch (error) {
                    return reject(error);
                }
            });
        }
        // Check User Existence in DB
    checkUserInDB(token) {
            return new Promise(async(resolve, reject) => {
                try {
                    // Initialisation of variables
                    let decoded = jwt.decode(token);
                    if (!decoded) { return resolve(false); }
                    let userId = decoded.id

                    const user = await Users.findOne({ where: { id: userId } });
                    if (user) return resolve(user);
                    return resolve(false);

                } catch (err) {
                    console.log("Check user in db")
                    return reject({ message: err, status: 0 });
                }

            })
        }
        // Check token in DB
    checkTokenInDB(token) {
            return new Promise(async(resolve, reject) => {
                try {
                    let tokenDetails = Buffer.from(token, 'binary').toString();
                    // Initializations of variables
                    var decoded = jwt.verify(tokenDetails, config.securityToken, { ignoreExpiration: true });
                    if (_.isEmpty(decoded)) {
                        return resolve(false);
                    }
                    const authenticate = await Authentication.findOne({ where: { token: tokenDetails } });
                    if (authenticate) return resolve(true);
                    return resolve(false);
                } catch (err) {
                    return resolve({ message: err, status: 0 });
                }
            })
        }
        // Check Token Expiration
    checkExpiration(token) {
        return new Promise(async(resolve, reject) => {
            let tokenDetails = Buffer.from(token, 'binary').toString();
            let status = false;
            const authenticate = await Authentication.findOne({ where: { token: tokenDetails } });
            if (authenticate && authenticate.tokenExpiryTime) {
                let expiryDate = Moment(authenticate.tokenExpiryTime, 'YYYY-MM-DD HH:mm:ss')
                let now = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                if (expiryDate > now) {
                    status = true;
                    resolve(status);
                }
            }
            resolve(status);
        })
    }
}

module.exports = Globals;