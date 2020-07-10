const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

module.exports = {
    preventCrossOverPath(currentSession, ID) {
        if ( currentSession !== ID ){
            throw new Error('You are not allowed in this path!');
        }
    },
    async findUserbyIC(nric) {
        try {
            return await db.employeeLeave.find({ "nric": nric }).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async checkExistingUser(nric) {
        try {
            return await db.user.find({ "nric": nric }).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async createUser(data) {
        try {
            return await db.user.insertOne(data);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async checkUsername(username) {
        try {
            return await db.user.find({ "username": username }).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async findUserByEmployeeID(employeeID) {
        try {
            return await db.employeeLeave.find({ "employeeID": employeeID }).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async updatePassword(obj) {
        try {
            return await db.user.findOneAndUpdate(
                { "username": obj.username },
                {
                    $set: { "password": obj.password }
                }
            );
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async addSubordinate(targetID, ID) {
        try {
            let [targetUser] = await this.findUserByEmployeeID(targetID);
            await db.employeeLeave.updateOne(
                { "_id": new ObjectId(targetUser._id) },
                {
                    $push: { subordinate: ID }
                }
            );
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async employeeInfoUpdate(ID, data) {
        try {
            return await db.employeeLeave.findOneAndUpdate(
                { "_id": new ObjectId(ID) },
                {
                    $set: {
                        employeeName: data.employeeName,
                        employeeRankCategory: data.employeeRankCategory,
                        nric: data.nric,
                        employeeGender: data.employeeGender,
                        employeeStatus: data.employeeStatus,
                        employeeChild: data.employeeChild,
                        subordinate: data.subordinate,
                        leaveEntitlement: {
                            annualLeave: data.annualLeave,
                            medicalLeave: data.medicalLeave,
                            hospitalisationLeave: data.hospitalisationLeave,
                            compassionateLeave: data.compassionateLeave,
                            childCareLeave: data.childCareLeave,
                            marriageLeave: data.marriageLeave
                        }
                    }
                },
                { upsert: true }
            )
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async deleteEmployee(ID) {
        try {
            return await db.employeeLeave.deleteOne(
                { "_id": new ObjectId(ID) }
            )
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async deleteEmployeeIDinSubordinate(employeeID) {
        try {
            return await db.employeeLeave.updateMany(
                { "subordinate": { $eq: employeeID } },
                { $pull: { "subordinate": employeeID } }
            )
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async findAll() {
        try {
            return await db.employeeLeave.find({}).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async createEmployee(obj) {
        try {
            return await db.employeeLeave.insertOne(
                {
                    companyID: obj.companyID,
                    employeeName: obj.employeeName,
                    employeeID: obj.employeeID,
                    employeeRankCategory: obj.employeeRankCategory,
                    nric: obj.nric,
                    employeeGender: obj.employeeGender,
                    employeeStatus: obj.employeeStatus,
                    employeeChild: obj.employeeChild,
                    subordinate: [],
                    tickets: [],
                    leaveEntitlement: {
                        annualLeave: obj.annualLeave,
                        medicalLeave: obj.medicalLeave,
                        hospitalisationLeave: obj.hospitalisationLeave,
                        compassionateLeave: obj.compassionateLeave,
                        childCareLeave: obj.childCareLeave,
                        marriageLeave: obj.marriageLeave
                    }
                }
            );
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async getSubUser(arr) {
        try {
            let subUserArr = [];
            let subUserTicketArr = [];
            for (let i = 0; i < arr.length; i++) {
                let [subUser] = await db.employeeLeave.find({ employeeID: arr[i] }).toArray();
                subUserArr.push(subUser);
            };
            for (let i = 0; i < subUserArr.length; i++) {
                for (let j = 0; j < subUserArr[i].tickets.length; j++) {
                    subUserArr[i].tickets[j].index = j;
                    subUserTicketArr.push(subUserArr[i].tickets[j]);
                };
            };
            return subUserTicketArr;
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async findUserByID(ID) {
        try {
            return await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray();
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async findUserByName(name) {
        try {
            return await db.employeeLeave.find({ "employeeName": name }).toArray()
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    async insertTicket(ID, obj) {
        try {
            return await db.employeeLeave.findOneAndUpdate(
                { _id: new ObjectId(ID) },
                { $push: { tickets: obj } }
            )
        } catch (err) {
            return res.render('errors/404', { err });
        };
    },
    momentifyTicketDate(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].submittedOn) {
            } else { arr[i].submittedOn = moment(arr[i].submittedOn).format('DD-MMM-YYYY'); };
            if (!arr[i].lastUpdatedOn) {
            } else { arr[i].lastUpdatedOn = moment(arr[i].lastUpdatedOn).format('DD-MMM-YYYY'); };
            if (!arr[i].leaveStart) {
            } else { arr[i].leaveStart = moment(arr[i].leaveStart).format('DD-MMM-YYYY'); };
            if (!arr[i].leaveEnd) {
            } else { arr[i].leaveEnd = moment(arr[i].leaveEnd).format('DD-MMM-YYYY'); };
            if (!arr[i].processedDate) {
            } else { arr[i].processedDate = moment(arr[i].processedDate).format('DD-MMM-YYYY'); };
        }
    },
    momentifyDateInObject(obj) {
        if (!obj.submittedOn) {
        } else { obj.submittedOn = moment(obj.submittedOn).format('DD-MMM-YYYY'); };
        if (!obj.lastUpdatedOn) {
        } else { obj.lastUpdatedOn = moment(obj.lastUpdatedOn).format('DD-MMM-YYYY'); };
        if (!obj.leaveStart) {
        } else { obj.leaveStart = moment(obj.leaveStart).format('DD-MMM-YYYY'); };
        if (!obj.leaveEnd) {
        } else { obj.leaveEnd = moment(obj.leaveEnd).format('DD-MMM-YYYY'); };
        if (!obj.processedDate) {
        } else { obj.processedDate = moment(obj.processedDate).format('DD-MMM-YYYY'); };
    },
    async updateTicket(ID, index, updateObj) {
        try {
            let arr_update_dict = { "$set": {} };
            arr_update_dict["$set"]["tickets." + index + ".leaveType"] = updateObj.leaveType;
            arr_update_dict["$set"]["tickets." + index + ".leaveStart"] = updateObj.leaveStart;
            arr_update_dict["$set"]["tickets." + index + ".leaveEnd"] = updateObj.leaveEnd;
            arr_update_dict["$set"]["tickets." + index + ".leaveReason"] = updateObj.leaveReason;
            arr_update_dict["$set"]["tickets." + index + ".lastUpdatedOn"] = updateObj.lastUpdatedDate;
            if (updateObj.applicationStatus === "Pending") {
                arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = updateObj.applicationStatus;
                arr_update_dict["$set"]["tickets." + index + ".processedBy"] = "";
                arr_update_dict["$set"]["tickets." + index + ".processedDate"] = "";
            }
            return await db.employeeLeave.updateOne({ _id: new ObjectId(ID) }, arr_update_dict);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async approveLeave(subID, index, processorName) {
        try {
            let arr_update_dict = { "$set": {} };
            arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = "Approved";
            arr_update_dict["$set"]["tickets." + index + ".processedBy"] = processorName;
            arr_update_dict["$set"]["tickets." + index + ".processedDate"] = new Date();
            return await db.employeeLeave.updateOne({ _id: new ObjectId(subID) }, arr_update_dict);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async rejectLeave(subID, index, processorName) {
        try {
            let arr_update_dict = { "$set": {} };
            arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = "Rejected";
            arr_update_dict["$set"]["tickets." + index + ".processedBy"] = processorName;
            return await db.employeeLeave.updateOne({ _id: new ObjectId(subID) }, arr_update_dict);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async deleteTicket(ID, index) {
        try {
            // nullify ticket
            let arr_update_dict = { "$unset": {} };
            arr_update_dict["$unset"]["tickets." + index] = 1;
            await db.employeeLeave.updateOne({ _id: new ObjectId(ID) }, arr_update_dict);

            // pull nullified ticket
            return await db.employeeLeave.updateOne(
                { _id: new ObjectId(ID) },
                { $pull: { tickets: null } }
            );
        } catch (err) {
            return res.render('errors/404', { err });
        }
    }
}