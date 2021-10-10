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
    static taskValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        taskName: Joi.string()
                            .required()
                            .error(() => 'taskName Required'),
                        categoryId: Joi.string()
                            .required()
                            .error(() => 'Category id Required'),
                        taskDescription: Joi.string()
                            .required()
                            .error(() => 'taskDescription  Required'),
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
    static taskGetValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        params: Joi.object({
                            id: Joi.string()
                                .guid()
                                .required()
                                .error(() => 'task Id Required')
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
        @Return     :   JSON String`
        **************************************************************************************/
    static taskUpdateValidator() {
            return async(req, res, next) => {
                try {
                    req.schema = Joi.object().keys({
                        taskId: Joi.string()
                            .required()
                            .error(() => 'task Id Required'),
                        taskName: Joi.string()
                            .required()
                            .error(() => 'task name Required'),
                        categoryId: Joi.string()
                            .required()
                            .error(() => 'Category id Required'),
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