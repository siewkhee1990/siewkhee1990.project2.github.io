const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('../controllers/repositoryController');

// const findAll = async () => {
//     try {
//         return await db.employeeLeave.find({}).toArray();
//     } catch (err) {
//         return res.render('errors/404', { err });
//     };
// };

// const getSubUser = async (arr) => {
//     try {
//         let subUserArr = [];
//         let subUserTicketArr = [];
//         for (let i = 0; i < arr.length; i++) {
//             let [subUser] = await db.employeeLeave.find({ employeeID: arr[i] }).toArray();
//             subUserArr.push(subUser);
//         };
//         for (let i = 0; i < subUserArr.length; i++) {
//             for (let j = 0; j < subUserArr[i].tickets.length; j++) {
//                 subUserArr[i].tickets[j].index = j;
//                 subUserTicketArr.push(subUserArr[i].tickets[j]);
//             };
//         };
//         return subUserTicketArr;
//     } catch (err) {
//         return res.render('errors/404', { err });
//     };
// };

// const findUserByID = async (ID) => {
//     try {
//         return await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray();
//     } catch (err) {
//         return res.render('errors/404', { err });
//     };
// };

// const findUserByName = async (name) => {
//     try {
//         return await db.employeeLeave.find({ "employeeName": name }).toArray()
//     } catch (err) {
//         return res.render('errors/404', { err });
//     };
// };

// const insertTicket = async (ID, obj) => {
//     try {
//         return await db.employeeLeave.findOneAndUpdate(
//             { _id: new ObjectId(ID) },
//             { $push: { tickets: obj } }
//         )
//     } catch (err) {
//         return res.render('errors/404', { err });
//     };
// };

// const momentifyTicketDate = (arr) => {
//     for (let i = 0; i < arr.length; i++) {
//         if (!arr[i].submittedOn) {
//         } else { arr[i].submittedOn = moment(arr[i].submittedOn).format('DD-MMM-YYYY'); };
//         if (!arr[i].lastUpdatedOn) {
//         } else { arr[i].lastUpdatedOn = moment(arr[i].lastUpdatedOn).format('DD-MMM-YYYY'); };
//         if (!arr[i].leaveStart) {
//         } else { arr[i].leaveStart = moment(arr[i].leaveStart).format('DD-MMM-YYYY'); };
//         if (!arr[i].leaveEnd) {
//         } else { arr[i].leaveEnd = moment(arr[i].leaveEnd).format('DD-MMM-YYYY'); };
//         if (!arr[i].processedDate) {
//         } else { arr[i].processedDate = moment(arr[i].processedDate).format('DD-MMM-YYYY'); };
//     }
// };

// const momentifyDateInObject = (obj) => {
//     if (!obj.submittedOn) {
//     } else { obj.submittedOn = moment(obj.submittedOn).format('DD-MMM-YYYY'); };
//     if (!obj.lastUpdatedOn) {
//     } else { obj.lastUpdatedOn = moment(obj.lastUpdatedOn).format('DD-MMM-YYYY'); };
//     if (!obj.leaveStart) {
//     } else { obj.leaveStart = moment(obj.leaveStart).format('DD-MMM-YYYY'); };
//     if (!obj.leaveEnd) {
//     } else { obj.leaveEnd = moment(obj.leaveEnd).format('DD-MMM-YYYY'); };
//     if (!obj.processedDate) {
//     } else { obj.processedDate = moment(obj.processedDate).format('DD-MMM-YYYY'); };
// };

// const updateTicket = async (ID, index, updateObj) => {
//     try {
//         let arr_update_dict = { "$set": {} };
//         arr_update_dict["$set"]["tickets." + index + ".leaveType"] = updateObj.leaveType;
//         arr_update_dict["$set"]["tickets." + index + ".leaveStart"] = updateObj.leaveStart;
//         arr_update_dict["$set"]["tickets." + index + ".leaveEnd"] = updateObj.leaveEnd;
//         arr_update_dict["$set"]["tickets." + index + ".leaveReason"] = updateObj.leaveReason;
//         arr_update_dict["$set"]["tickets." + index + ".lastUpdatedOn"] = updateObj.lastUpdatedDate;
//         if (updateObj.applicationStatus === "Pending") {
//             arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = updateObj.applicationStatus;
//             arr_update_dict["$set"]["tickets." + index + ".processedBy"] = "";
//             arr_update_dict["$set"]["tickets." + index + ".processedDate"] = "";
//         }
//         return await db.employeeLeave.updateOne({ _id: new ObjectId(ID) }, arr_update_dict);
//     } catch (err) {
//         return res.render('errors/404', { err });
//     }
// };

// const approveLeave = async (subID, index, processorName) => {
//     try {
//         let arr_update_dict = { "$set": {} };
//         arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = "Approved";
//         arr_update_dict["$set"]["tickets." + index + ".processedBy"] = processorName;
//         arr_update_dict["$set"]["tickets." + index + ".processedDate"] = new Date();
//         return await db.employeeLeave.updateOne({ _id: new ObjectId(subID) }, arr_update_dict);
//     } catch (err) {
//         return res.render('errors/404', { err });
//     }
// };

// const rejectLeave = async (subID, index, processorName) => {
//     try {
//         let arr_update_dict = { "$set": {} };
//         arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = "Rejected";
//         arr_update_dict["$set"]["tickets." + index + ".processedBy"] = processorName;
//         return await db.employeeLeave.updateOne({ _id: new ObjectId(subID) }, arr_update_dict);
//     } catch (err) {
//         return res.render('errors/404', { err });
//     }
// };

// const deleteTicket = async (ID, index) => {
//     try {
//         // nullify ticket
//         let arr_update_dict = { "$unset": {} };
//         arr_update_dict["$unset"]["tickets." + index] = 1;
//         await db.employeeLeave.updateOne({ _id: new ObjectId(ID) }, arr_update_dict);

//         // pull nullified ticket
//         return await db.employeeLeave.updateOne(
//             { _id: new ObjectId(ID) },
//             { $pull: { tickets: null } }
//         );
//     } catch (err) {
//         return res.render('errors/404', { err });
//     }
// };

module.exports = {
    // login(req, res) {
    //     res.render('leave/login', {});
    // },
    // resetPasswordForm(req, res) {
    //     res.render('leave/reset', {});
    // },
    // findUserForm(req, res) {
    //     res.render('leave/findUser', {})
    // },
    // find(req, res) {
    //     console.log(req.body);
    //     res.redirect('/');
    // },
    // checkLogin(req, res) {
    //     console.log(req.body.username, req.body.password);
    //     res.redirect('/' + req.body.username);
    // },
    // resetPassword(req, res) {
    //     //res.alert
    //     res.render('/', {});
    // },
    // async dash(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let [user] = await repositoryController.findUserByID(ID);
    //         let subUserTicket = await getSubUser(user.subordinate);
    //         momentifyTicketDate(user.tickets);
    //         momentifyTicketDate(subUserTicket);
    //         res.render('leave/dashboard', { employeeID: ID, data: user, subUserData: subUserTicket });
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async view(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let [user] = await findUserByID(ID);
    //         let index = req.params.ticketIndex;
    //         let ticketData = user.tickets[index];
    //         momentifyDateInObject(ticketData);
    //         res.render('leave/show', { data: ticketData, userID: ID, ticketIndex: index, userData: user });
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async apply(req, res) {
    //     let ID = req.params.employeeID;
    //     let [user] = await findUserByID(ID);
    //     let totalApplications = {
    //         "annualLeave": 0,
    //         "medicalLeave": 0,
    //         "hospitalisationLeave": 0,
    //         "childCareLeave": 0
    //     };
    //     for (let i = 0; i < user.tickets.length; i++) {
    //         if (user.tickets[i].applicationStatus === "Rejected") {

    //         } else {
    //             let end = user.tickets[i].leaveEnd;
    //             let start = user.tickets[i].leaveStart;
    //             let totalDays = ((end - start) / (1000 * 60 * 60 * 24)) + 1;
    //             totalApplications[user.tickets[i].leaveType] += totalDays;
    //         }
    //     };
    //     let balanceLeave = {
    //         "annualLeave": 0,
    //         "medicalLeave": 0,
    //         "hospitalisationLeave": 0,
    //         "childCareLeave": 0
    //     };
    //     Object.keys(user.leaveEntitlement).map((a) => { balanceLeave[a] = user.leaveEntitlement[a] - totalApplications[a] });
    //     let keysArray = Object.keys(user.leaveEntitlement);
    //     res.render('leave/application', { userID: ID, data: user.leaveEntitlement, entitlementArray: keysArray, balanceLeaveArray: balanceLeave })
    // },
    // async applicationSubmit(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let [user] = await findUserByID(ID);
    //         let info = req.body;
    //         let currentDate = new Date();
    //         let startDate = new Date(info.leaveStart);
    //         let endDate = new Date(info.leaveEnd);
    //         let ticket = {
    //             'requestedBy': user.employeeName,
    //             'submittedOn': currentDate,
    //             'lastUpdatedOn': currentDate,
    //             'leaveType': info.leaveType,
    //             'leaveReason': info.leaveReason,
    //             'leaveStart': startDate,
    //             'leaveEnd': endDate,
    //             'applicationStatus': 'Pending',
    //             'processedBy': '',
    //             'processedDate': ''
    //         };
    //         let { lastErrorObject } = await insertTicket(ID, ticket);
    //         if (!lastErrorObject.n) throw new Error('insertion failure');
    //         res.redirect('/' + ID);
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async edit(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let [user] = await findUserByID(ID);
    //         let index = req.params.ticketIndex;
    //         let ticketData = user.tickets[index];
    //         momentifyDateInObject(ticketData);
    //         res.render('leave/edit', { data: ticketData, userID: ID, ticketIndex: index, userData: user });
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async submitEdit(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let [user] = await findUserByID(ID);
    //         let index = req.params.ticketIndex;
    //         let info = req.body;
    //         if (user.tickets[index].applicationStatus === "Approved" || user.tickets[index].applicationStatus === "Rejected") {
    //             info.applicationStatus = "Pending";
    //         }
    //         info.lastUpdatedDate = new Date();
    //         info.leaveStart = new Date(info.leaveStart);
    //         info.leaveEnd = new Date(info.leaveEnd);
    //         if (info.leaveType === user.tickets[index].leaveType && info.leaveStart.getTime() === user.tickets[index].leaveStart.getTime() && info.leaveEnd.getTime() === user.tickets[index].leaveEnd.getTime() && info.leaveReason === user.tickets[index].leaveReason) {
    //             res.redirect('/' + ID);
    //         } else {
    //             let { modifiedCount } = await updateTicket(ID, index, info);
    //             if (!modifiedCount) {
    //                 throw new Error('update failure');
    //             } else {
    //                 res.redirect('/' + ID);
    //             }
    //         }
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async approve(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let subName = req.params.subEmployeeName;
    //         let [user] = await findUserByID(ID);
    //         let [subUser] = await findUserByName(subName);
    //         let index = req.params.ticketIndex;
    //         let { modifiedCount } = await approveLeave(subUser._id, index, user.employeeName);
    //         if (!modifiedCount) {
    //             throw new Error('update failure');
    //         } else {
    //             res.redirect('/' + ID);
    //         }
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async reject(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let subName = req.params.subEmployeeName;
    //         let [user] = await findUserByID(ID);
    //         let [subUser] = await findUserByName(subName);
    //         let index = req.params.ticketIndex;
    //         let { modifiedCount } = await rejectLeave(subUser._id, index, user.employeeName);
    //         if (!modifiedCount) {
    //             throw new Error('update failure');
    //         } else {
    //             res.redirect('/' + ID);
    //         }
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    // async deleteTicket(req, res) {
    //     try {
    //         let ID = req.params.employeeID;
    //         let index = req.params.ticketIndex;
    //         let { modifiedCount } = await deleteTicket(ID, index);
    //         if (!modifiedCount) {
    //             throw new Error('delete ticket failed');
    //         } else {
    //             res.redirect('/' + ID);
    //         }
    //     } catch (err) {
    //         return res.render('errors/404', { err });
    //     }
    // },
    async createEmployee(req, res) {
        try {
            let allUser = await repositoryController.findAll();
            let ID = req.params.employeeID;
            let idArr = [];
            for (let i = 0; i < allUser.length; i++) {
                idArr.push(allUser[i].employeeID);
            };
            let newID = (Math.max(...idArr)) + 1;
            res.render('employee/create', { data: allUser, userID: ID, newID: newID })
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    viewEmployee(req, res) {
        console.log("view");
    },
    editEmployee(req, res) {
        console.log('edit');
    },
    async createEmployeeSubmit(req, res) {
        try {
            console.log('submit');
            let ID = req.params.employeeID;
            let [user] = await repositoryController.findUserByID(ID);
            req.body.companyID = user.companyID;
            await repositoryController.createEmployee(req.body);
            res.redirect('/'+ID);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    updateEmployee(req, res) {
        console.log('update');
    },
    deleteEmployee(req, res) {
        console.log('delete');
    }
    // let ID = req.params.employeeID;
    // let index = req.params.ticketIndex;
    // let lastUpdate = new Date();
    // try {
    //     //await updateTicket(ID, index, lastUpdate);
    //     if (!matchedCount) throw new Error(`${name} doesn't exist`);
    //     res.redirect('leave/dashboard', {});
    // } catch (err) {
    //     return res.render('errors/404', { err });
    // }
    // },
    //     const items = await shopRepository.getAll();
    //     res.render('shop/index', { items });
    // },
    // async show(req, res) {
    //     try {
    //         const item = await shopRepository.show(req.params.name);
    //         return res.send(item);
    //     } catch (err) {
    //         return res.send(err.message);
    //     }
    // },
    // async toCreate(req, res) {
    //     res.render('shop/create', {});
    // },
    // async create(req, res) {
    //     req.body.price = parseInt(req.body.price);
    //     req.body.qty = parseInt(req.body.qty);

    //     try {
    //         await shopRepository.create(req.body);
    //         //return res.send(req.body);
    //         res.redirect('/');
    //     } catch (err) {
    //         return res.send(err.message);
    //     }
    // },
    // async getOneByName(req, res) {
    //     try {
    //         const item = await shopRepository.getOneByName(req.params.name);
    //         res.render('shop/show', { item });
    //     } catch (err) {
    //         res.render('errors/404', { err });
    //     }
    // },
    // async edit(req, res) {
    //     try {
    //         const item = await shopRepository.show(req.params.name);
    //         console.log(item);
    //         res.render('shop/update', { item });
    //     } catch (err) {
    //         return res.send(err.message);
    //     }
    // },
    // async update(req, res) {
    //     const input = req.body;
    //     try {
    //         const updatedObject = await shopRepository.updateOne(input);
    //         console.log(updatedObject);
    //         res.redirect('/');
    //     } catch (err) {
    //         return res.send(err.message);
    //     }
    // },
    // async remove(req, res) {
    //     const input = req.params.name;
    //     try {
    //         const deletedItem = await shopRepository.deleteOne(input);
    //         console.log(deletedItem);
    //         res.redirect('/');
    //     } catch (err) {
    //         return res.send(err.message);
    //     }
    // }
}