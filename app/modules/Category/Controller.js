const _ = require("lodash");

const Controller = require("../Base/Controller");
const CategorySchema = require('./Schema').Category;
const CommonService = require("../../services/Common");
const RequestBody = require("../../services/RequestBody");
const exportLib = require('../../../lib/Exports');
const TaskSchema = require('../Task/Schema').Task;

class CategoryController extends Controller {

    constructor() {
        super();
    }

    /********************************************************
    Purpose: add category
    Parameter:
    {
        "name": "work"
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
    Purpose: update  category record
    Parameter:
    {
        "name": "work",
        "categoryId": "606aa83d-ab96-4741-97c1-103629859a5f"
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
        "categoryId": "606aa83d-ab96-4741-97c1-103629859a5f"
    }
    Return: JSON String
     ********************************************************/
    async deleteCategory() {
        try {
            let categoryCount = await CategorySchema.findOne({ where: { id: this.req.body.categoryId } })
            if (!categoryCount) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'NOT_FOUND', message: exportLib.ResponseEn.CATEGORY_EXIST });
            }
            let checkTask = await TaskSchema.findOne({ where: { CategoryId: this.req.body.categoryId } })
            if (checkTask) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'NOT_FOUND', message: exportLib.ResponseEn.TASK_WITH_CATEGORY_EXIST });
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