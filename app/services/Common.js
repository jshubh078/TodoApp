/****************************
 Common services
 ****************************/
const _ = require("lodash");
const bcrypt = require('bcrypt');
const Config = require('../../configs/configs');

class Common {

    /********************************************************
    Purpose: Encrypt password
    Parameter:
        {
            "data":{
                "password" : "test123"
            }
        }
    Return: JSON String
    ********************************************************/
    ecryptPassword(data) {
        return new Promise(async(resolve, reject) => {
            try {
                if (data && data.password) {
                    let password = bcrypt.hashSync(data.password, 10);
                    return resolve(password);
                }
                return resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /********************************************************
    Purpose: Compare password
    Parameter:
        {
            "data":{
                "password" : "Buffer data", // Encrypted password
                "savedPassword": "Buffer data" // Encrypted password
            }
        }
    Return: JSON String
    ********************************************************/
    verifyPassword(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let isVerified = false;
                if (data && data.password && data.savedPassword) {
                    let base64data = Buffer.from(data.savedPassword, 'binary').toString();
                    isVerified = await bcrypt.compareSync(data.password, base64data)
                }
                return resolve(isVerified);
            } catch (error) {
                reject(error);
            }
        });
    }

    /********************************************************
    Purpose: Validate password
    Parameter:
        {
            "data":{
                "password" : "test123",
                "userObj": {}
            }
        }
    Return: JSON String
    ********************************************************/
    validatePassword(data) {
        return new Promise(async(resolve, reject) => {
            try {
                if (data && data.password) {
                    if (data.userObj && _.isEqual(data.password, data.userObj.firstname)) {
                        return resolve({ status: 0, message: i18n.__("PASSWORD_NOT_SAME_FIRSTNAME") });
                    }
                    // Check new password is already used or not
                    if (Config.dontAllowPreviouslyUsedPassword && Config.dontAllowPreviouslyUsedPassword == 'true' && data.userObj && data.userObj.previouslyUsedPasswords && Array.isArray(data.userObj.previouslyUsedPasswords) && data.userObj.previouslyUsedPasswords.length) {
                        let isPreviouslyUsed = _.filter(data.userObj.previouslyUsedPasswords, (previouslyUsedPassword) => {
                            let base64data = Buffer.from(previouslyUsedPassword, 'binary').toString();
                            return bcrypt.compareSync(data.password, base64data)
                        });
                        if (isPreviouslyUsed && Array.isArray(isPreviouslyUsed) && isPreviouslyUsed.length) {
                            return resolve({ status: 0, message: i18n.__("ALREADY_USED_PASSWORD") });
                        }
                    }
                    return resolve({ status: 1, message: "Valid password." });
                } else {
                    return resolve({ status: 0, message: "Password required." });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Common;