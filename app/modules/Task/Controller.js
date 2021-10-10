const _ = require("lodash");

const Controller = require("../Base/Controller");
const TaskSchema = require('./Schema').Task;
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
    async addTask() {
        try {
            let fieldsArray = ["taskName", "taskDescription", "categoryId"]
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

            let filter = { taskName: data.taskName };
            let recordExist = await TaskSchema.findOne({ where: filter });
            if (!_.isEmpty(recordExist)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.TASK_EXIST });
            }
            let userId = this.req.currentUser;
            await TaskSchema.create({ taskName: data.taskName, taskDescription: data.taskDescription, CategoryId: data.categoryId, UserId: userId.id });

            return exportLib.Response.handleMessageResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.TASK_SUCCESS });
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
            let recordData = await TaskSchema.findOne({
                attributes: ['id', 'taskName', 'taskDescription'],
                where: { id: this.req.params.id }
            });

            if (_.isEmpty(recordData)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.NOT_FOUND });

            } else {
                return exportLib.Response.handleResponse(this.res, { status: true, code: 'SUCCESS', message: "", data: recordData });
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
    async updateTask() {
        try {
            let fieldsArray = ["taskId", "taskName", "taskDescription", "categoryId"]
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

            let filter = {
                taskName: data.taskName,
                id: {
                    [Op.ne]: data.categoryId
                }
            };
            let recordExist = await TaskSchema.findOne({ where: filter });
            if (!_.isEmpty(recordExist)) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.TASK_EXIST });
            }
            await TaskSchema.update({ taskName: data.taskName, taskDescription: data.taskDescription, categoryId: data.categoryId }, { where: { id: data.taskId } });

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
    async deleteTask() {
        try {
            let checkTask = await TaskSchema.findOne({ where: { id: this.req.body.taskId } })
            console.log(checkTask, 'checktask')
            if (!checkTask) {
                return exportLib.Error.handleError(this.res, { status: false, code: 'CONFLICT', message: exportLib.ResponseEn.TASK_EXIST });
            }

            await TaskSchema.destroy({ where: { id: this.req.body.taskId } });
            return exportLib.Response.handleMessageResponse(this.res, { status: true, code: 'SUCCESS', message: exportLib.ResponseEn.RECORD_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.log("error- ", error);
            return exportLib.Error.handleError(this.res, { status: false, code: 'INTERNAL_SERVER_ERROR', message: error });
        }
    }


}
module.exports = CategoryController;