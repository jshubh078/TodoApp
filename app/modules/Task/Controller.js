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
    Purpose: create Task
    Parameter:
    {
        "taskName": "work",
        "taskDescription": "work one",
        "categoryId": "606aa83d-ab96-4741-97c1-103629859a5f",
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
     Purpose: get data
     Parameter:
    {
        "id": "606aa83d-ab96-4741-97c1-103629859a5f",
    }
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
        "taskName": "work",
        "taskDescription": "work one",
        "categoryId": "work",
        "taskId":"606aa83d-ab96-4741-97c1-103629859a5f"
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
    Purpose: task  delete
    Parameter:
    {
        "taskId": "606aa83d-ab96-4741-97c1-103629859a5f"
    }
    Return: JSON String
     ********************************************************/
    async deleteTask() {
        try {
            let checkTask = await TaskSchema.findOne({ where: { id: this.req.body.taskId } })

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