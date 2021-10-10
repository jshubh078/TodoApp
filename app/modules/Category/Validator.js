const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const exportLib = require('../../../lib/Exports');

class Validators {
    /*************************************************************************************
    @Purpose    :   Function for category validator
    @Parameter  :   {
        emailId     *: String,
        passowrd  *: String
    }
    @Return     :   JSON String
    **************************************************************************************/
    static categoryValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        name: Joi.string()
                            .required()
                            .error(() => 'Name Required')
                    });
                    next();
                } catch (error) {
                    console.error(
                        'error In ====>>>> create UsereValidator <<<<====',
                        error
                    );
                    return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error });
                }
            };
        }
        /*************************************************************************************
    @Purpose    :   Function for edit category validator for id
    @Parameter  :   {
        emailId     *: String,
        passowrd  *: String
    }
    @Return     :   JSON String
    **************************************************************************************/
    static categoryGetValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        params: Joi.object({
                            id: Joi.string()
                                .guid()
                                .required()
                                .error(() => 'Id Required')
                        })
                    });
                    next();
                } catch (error) {
                    console.error(
                        'error In ====>>>> create UsereValidator <<<<====',
                        error
                    );
                    return exportLib.Error.handleError(res, { code: 'UNPROCESSABLE_ENTITY', message: error });
                }
            };
        }
        /*************************************************************************************
    @Purpose    :   Function for edit category validator for id
    @Parameter  :   {
        emailId     *: String,
        passowrd  *: String
    }
    @Return     :   JSON String
    **************************************************************************************/
    static categoryUpdateValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        categoryId: Joi.string()
                            .required()
                            .error(() => 'category Id Required'),
                        name: Joi.string()
                            .required()
                            .error(() => 'name Required')
                    });
                    next();
                } catch (error) {
                    console.error(
                        'error In ====>>>> create UsereValidator <<<<====',
                        error
                    );
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