const _ = require("lodash");

const Controller = require("../Base/Controller");
const CategorySchema = require('./Schema').Category;
const CommonService = require("../../services/Common");
const RequestBody = require("../../services/RequestBody");
const exportLib = require('../../../lib/Exports');


class CategoryController extends Controller {

    constructor() {
        super();
    }

    /********************************************************
    Purpose: add record
    Parameter:
    {
        "name": "pizza"
    }
    Return: JSON String
    ********************************************************/
    async addCategory() {
        try {
            let fieldsArray = ["name"]
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

            let filter = { name: data.name };
            let recordExist = await CategorySchema.findOne({ where: filter });
            if (!_.isEmpty(recordExist)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.CATEGORY_EXIST });
            }
            await CategorySchema.create({ name: data.name });

            return exportLib.Response.handleMessageResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.CATEGORY_SUCCESS });
        } catch (error) {
            console.log(error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });
        }
    }

    /********************************************************
     Purpose: get edit data
     Return: JSON String
     ********************************************************/
    async getEdit() {
        try {
            let recordData = await CategorySchema.findOne({
                attributes: ['id', 'name'],
                where: { id: this.req.params.id }
            });

            if (_.isEmpty(recordData)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.CATEGORY_EXIST });
            } else {
                return this.res.send({ status: 1, data: recordData });
            }
        } catch (error) {
            console.log("error- ", error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });
        }
    }

    /********************************************************
    Purpose: update record
    Parameter:
    {
        "name": "pizza",
        "categoryId": 1
    }
    Return: JSON String
    ********************************************************/
    async updateCategory() {
        try {
            let fieldsArray = ["name", "categoryId"]
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

            let filter = {
                name: data.name,
                id: {
                    [Op.ne]: data.categoryId
                }
            };
            let recordExist = await CategorySchema.findOne({ where: filter });
            if (!_.isEmpty(recordExist)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.CATEGORY_EXIST });
            }
            await CategorySchema.update({ name: data.name }, { where: { id: data.categoryId } });

            return exportLib.Response.handleMessageResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.RECORD_UPDATED_SUCCESSFULLY });
        } catch (error) {
            console.log(error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });
        }
    }


    /********************************************************
    Purpose: record delete
    Parameter:
    {
        "categoryId": "1"
    }
    Return: JSON String
     ********************************************************/
    async deleteCategory() {
        try {
            let categoryCount = await CategorySchema.count({ where: { categoryId: this.req.body.categoryId } })
            if (categoryCount) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.CATEGORY_EXIST });
            }

            await CategorySchema.destroy({ where: { id: this.req.body.categoryId } });
            return exportLib.Response.handleMessageResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.RECORD_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.log("error- ", error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });
        }
    }


}
module.exports = CategoryController;