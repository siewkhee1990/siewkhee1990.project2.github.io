const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('../controllers/repositoryController');

module.exports = {
    async createEmployee(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let allUser = await repositoryController.findAll();
            let ID = req.params.employeeID;
            let idArr = [];
            for (let i = 0; i < allUser.length; i++) {
                idArr.push(allUser[i].employeeID);
            };
            let newID = (Math.max(...idArr)) + 1;
            res.render('employee/create', { data: allUser, userID: ID, newID: newID })
        } catch (err) {
            return err;
        };
    },
    async viewEmployee(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let allUser = await repositoryController.findAll();
            let [user] = await repositoryController.findUserByID(ID);
            res.render('employee/employeeDashboard', { data: allUser, userID: ID, userData: user })
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async viewEmployeeDetails(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ownID = req.params.employeeID;
            let theEmployeeID = req.params.targetEmployee;
            let [theEmployeeData] = await repositoryController.findUserByID(theEmployeeID);
            let allUser = await repositoryController.findAll();
            res.render('employee/employeeShow', { userID: ownID, theEmployeeID: theEmployeeID, data: theEmployeeData, allData: allUser });
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async editEmployee(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let userID = req.params.employeeID;
            let updateID = req.params.targetEmployee;
            let [originalData] = await repositoryController.findUserByID(updateID);
            let allUser = await repositoryController.findAll();
            res.render('employee/employeeEdit', { userID: userID, updateID: updateID, data: originalData, allData: allUser });
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async createEmployeeSubmit(req, res) {
        try {
            let existingUser = await repositoryController.findUserbyIC(req.body.nric.toUpperCase());
            if (existingUser.length >= 1) {
                throw new Error('user exists!');
            } else {
                let ID = req.params.employeeID;
                let [user] = await repositoryController.findUserByID(req.session.currentUser.uID, ID);
                req.body.companyID = user.companyID;
                req.body.nric = req.body.nric.toUpperCase();
                let toEmployee = req.body.reportTo;
                let theEmployeeID = req.body.employeeID;
                if (!toEmployee) {
                    await repositoryController.createEmployee(req.body);
                } else if (typeof toEmployee === "string") {
                    await repositoryController.createEmployee(req.body);
                    await repositoryController.addSubordinate(toEmployee, theEmployeeID);
                } else if (typeof toEmployee === "object") {
                    await repositoryController.createEmployee(req.body);
                    for (let i = 0; i < req.body.reportTo.length; i++) {
                        await repositoryController.addSubordinate(toEmployee[i], theEmployeeID);
                    };
                };
                res.redirect('/' + ID + '/employeeManage');
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async updateEmployee(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let target = req.params.targetEmployee;
            let updateData = req.body;
            if (!updateData.subordinate) {
                updateData.subordinate = [];
            };
            await repositoryController.employeeInfoUpdate(target, updateData);
            res.redirect('/' + ID + '/employeeManage');
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async deleteEmployee(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let deleteID = req.params.targetEmployee;
            let [user] = await repositoryController.findUserByID(deleteID);
            await repositoryController.deleteEmployeeIDinSubordinate(user.employeeID);
            await repositoryController.deleteEmployee(deleteID);
            res.redirect('/' + ID + '/employeeManage');
        } catch (err) {
            return res.render('errors/404', { err });
        }
    }
}