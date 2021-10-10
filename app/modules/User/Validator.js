const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const exportLib = require('../../../lib/Exports');
class Validators {
    /*************************************************************************************
     @Purpose    :   Function for signup validator
     @Parameter  :   {
         emailId     *: String,
         passowrd  *: String
     }
     @Return     :   JSON String
     **************************************************************************************/
    static signupValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        firstName: Joi.string()
                            .required()
                            .error(() => 'First Name Required'),
                        lastName: Joi.string()
                            .trim()
                            .required()
                            .error(() => 'Last Name Required'),
                        emailId: Joi.string()
                            .trim()
                            .required()
                            .error(() => 'emailId Required'),
                        password: Joi.string()
                            .trim()
                            .required()
                            .error(() => 'password Required'),
                    });
                    next();
                } catch (error) {
                    console.error(
                        'error In ====>>>> signup UserValidator <<<<====',
                        error
                    );
                    return handleError(res, {
                        status: false,
                        code: RESPONSECODES.INTERNAL_SERVER_ERROR,
                        message: error,
                    });
                }
            };
        }
        /*************************************************************************************
          @Purpose    :   Function for login validator
          @Parameter  :   {
              emailId     *: String,
              passowrd  *: String
          }
          @Return     :   JSON String
          **************************************************************************************/
    static loginValidator() {
        return async(req, res, next) => {
            try {
                req.schema = Joi.object().keys({
                    emailId: Joi.string()
                        .trim()
                        .email()
                        .required()
                        .error(() => 'Valid Email Required'),
                    // password: Joi.string().trim().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+/*-.])[A-Za-z\d@!@#$%^&*()_+/*-.]{8,}$/).required().error(() => 'Password validation')
                    password: Joi.string()
                        .trim()
                        .required()
                        .error(() => 'Password validation'),
                });
                next();
            } catch (error) {
                console.error('error In ====>>>> loginValidator <<<<====', error);
                return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error });
            }
        };
    }

    /*************************************************************************************
                    V A L I D A T E - B O D Y
    **************************************************************************************/
    static validateBody(req, res, next) {
        try {
            const { error } = Joi.validate(req.body, req.schema);
            if (error) {
                console.log(error, 'error')
                return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error.details[0].message });
            }

            next();
        } catch (error) {
            console.error('error In ====>>>> validateBody <<<<====', error);
            return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error });


        }
    }

    /*************************************************************************************
                      V A L I D A T E - P A R M S
      **************************************************************************************/
    static validateParams(req, res, next) {
        try {
            const { error } = Joi.validate(req.params, req.schema);
            if (error) {
                return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error.details[0].message });
            }

            next();
        } catch (error) {
            console.error('error In ====>>>> validateParams <<<<====', error);
            return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error });
        }
    }
}

module.exports = Validators;