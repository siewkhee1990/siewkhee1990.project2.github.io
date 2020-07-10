const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('../controllers/repositoryController');

module.exports = {
    async dash(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            let subUserTicket = await repositoryController.getSubUser(user.subordinate);
            repositoryController.momentifyTicketDate(user.tickets);
            repositoryController.momentifyTicketDate(subUserTicket);
            res.render('leave/leaveDashboard', { employeeID: ID, data: user, subUserData: subUserTicket });
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async view(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            let index = req.params.ticketIndex;
            let ticketData = user.tickets[index];
            repositoryController.momentifyDateInObject(ticketData);
            res.render('leave/leaveShow', { data: ticketData, userID: ID, ticketIndex: index, userData: user });
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async apply(req, res) {
        repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
        let ID = req.params.employeeID;
        let [user] = await repositoryController.findUserByID(ID);
        let totalApplications = {
            "annualLeave": 0,
            "medicalLeave": 0,
            "hospitalisationLeave": 0,
            "compassionateLeave": 0,
            "childCareLeave": 0,
            "marriageLeave": 0
        };
        for (let i = 0; i < user.tickets.length; i++) {
            if (user.tickets[i].applicationStatus === "Rejected") {

            } else {
                let end = user.tickets[i].leaveEnd;
                let start = user.tickets[i].leaveStart;
                let totalDays = ((end - start) / (1000 * 60 * 60 * 24)) + 1;
                totalApplications[user.tickets[i].leaveType] += totalDays;
            }
        };
        let balanceLeave = {
            "annualLeave": 0,
            "medicalLeave": 0,
            "hospitalisationLeave": 0,
            "compassionateLeave": 0,
            "childCareLeave": 0,
            "marriageLeave": 0
        };
        Object.keys(user.leaveEntitlement).map((a) => { balanceLeave[a] = user.leaveEntitlement[a] - totalApplications[a] });
        let keysArray = Object.keys(user.leaveEntitlement);
        res.render('leave/application', { userID: ID, data: user.leaveEntitlement, entitlementArray: keysArray, balanceLeaveArray: balanceLeave })
    },
    async applicationSubmit(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            let info = req.body;
            let currentDate = new Date();
            let startDate = new Date(info.leaveStart);
            let endDate = new Date(info.leaveEnd);
            let ticket = {
                'requestedBy': user.employeeName,
                'submittedOn': currentDate,
                'lastUpdatedOn': currentDate,
                'leaveType': info.leaveType,
                'leaveReason': info.leaveReason,
                'leaveStart': startDate,
                'leaveEnd': endDate,
                'applicationStatus': 'Pending',
                'processedBy': '',
                'processedDate': ''
            };
            let { lastErrorObject } = await repositoryController.insertTicket(ID, ticket);
            if (!lastErrorObject.n) throw new Error('insertion failure');
            res.redirect('/' + ID);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async edit(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            let index = req.params.ticketIndex;
            let ticketData = user.tickets[index];
            repositoryController.momentifyDateInObject(ticketData);
            res.render('leave/leaveEdit', { data: ticketData, userID: ID, ticketIndex: index, userData: user });
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async submitEdit(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            let index = req.params.ticketIndex;
            let info = req.body;
            if (user.tickets[index].applicationStatus === "Approved" || user.tickets[index].applicationStatus === "Rejected") {
                info.applicationStatus = "Pending";
            }
            info.lastUpdatedDate = new Date();
            info.leaveStart = new Date(info.leaveStart);
            info.leaveEnd = new Date(info.leaveEnd);
            if (info.leaveType === user.tickets[index].leaveType && info.leaveStart.getTime() === user.tickets[index].leaveStart.getTime() && info.leaveEnd.getTime() === user.tickets[index].leaveEnd.getTime() && info.leaveReason === user.tickets[index].leaveReason) {
                res.redirect('/' + ID);
            } else {
                let { modifiedCount } = await repositoryController.updateTicket(ID, index, info);
                if (!modifiedCount) {
                    throw new Error('update failure');
                } else {
                    res.redirect('/' + ID);
                }
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async approve(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let subName = req.params.subEmployeeName;
            let [user] = await repositoryController.findUserByID(ID);
            let [subUser] = await repositoryController.findUserByName(subName);
            let index = req.params.ticketIndex;
            let { modifiedCount } = await repositoryController.approveLeave(subUser._id, index, user.employeeName);
            if (!modifiedCount) {
                throw new Error('update failure');
            } else {
                res.redirect('/' + ID);
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async reject(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let subName = req.params.subEmployeeName;
            let [user] = await repositoryController.findUserByID(ID);
            let [subUser] = await repositoryController.findUserByName(subName);
            let index = req.params.ticketIndex;
            let { modifiedCount } = await repositoryController.rejectLeave(subUser._id, index, user.employeeName);
            if (!modifiedCount) {
                throw new Error('update failure');
            } else {
                res.redirect('/' + ID);
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async deleteTicket(req, res) {
        try {
            repositoryController.preventCrossOverPath(req.session.currentUser.uID, req.params.employeeID);
            let ID = req.params.employeeID;
            let index = req.params.ticketIndex;
            let { modifiedCount } = await repositoryController.deleteTicket(ID, index);
            if (!modifiedCount) {
                throw new Error('delete ticket failed');
            } else {
                res.redirect('/' + ID);
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    }
}