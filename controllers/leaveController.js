const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

const getSubUser = async (arr) => {
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
        }
    }
    return subUserTicketArr;
};

const findUserByID = async (ID) => {
    return await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray()
};

const insertTicket = async (ID, obj) => {
    return await db.employeeLeave.findOneAndUpdate(
        { _id: new ObjectId(ID) },
        { $push: { tickets: obj } }
    )
};

const momentifyTicketDate = (arr) => {
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
};

const momentifyDateInObject = (obj) => {
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
};

const updateTicket = async (ID, index, updateObj) => {
    let arr_update_dict = { "$set": {} };
    arr_update_dict["$set"]["tickets." + index + ".leaveType"] = updateObj.leaveType;
    arr_update_dict["$set"]["tickets." + index + ".leaveStart"] = updateObj.leaveStart;
    arr_update_dict["$set"]["tickets." + index + ".leaveEnd"] = updateObj.leaveEnd;
    arr_update_dict["$set"]["tickets." + index + ".leaveReason"] = updateObj.leaveReason;
    arr_update_dict["$set"]["tickets." + index + ".lastUpdatedOn"] = updateObj.lastUpdatedDate;
    if ( updateObj.applicationStatus === "Pending" ) {
        arr_update_dict["$set"]["tickets." + index + ".applicationStatus"] = updateObj.applicationStatus;
        arr_update_dict["$set"]["tickets." + index + ".processedBy"] = "";
        arr_update_dict["$set"]["tickets." + index + ".processedDate"] = "";
    }
    return await db.employeeLeave.updateOne({ _id: new ObjectId(ID) }, arr_update_dict);
};

// const updateTicket = async (ID, ticketIndex, changes) => {
//     return await db.employeeLeave.findOneAndUpdate(
//         { _id: new ObjectId(ID) },
//         { $set: { 
//             ticket[ticketIndex].lastUpdatedOn: changes,
//         }
//     )
// }

// const getAll = () => {
//     return db.shop.find()
//         .toArray();
// }

// const show = async (name) => {
//     const item = await db.shop.findOne({ name: { '$regex': `^${name}$`, '$options': 'i' } });
//     if (!item) throw new Error('Non-existance');
//     return item;
// }

// const create = async (item) => {
//     try {
//         const result = await db.shop.insertOne(item);
//         return result;
//     } catch (err) {
//         throw new Error(`Due to ${err.message}, you are not allowed to insert this item ${JSON.stringify(item)}`);
//     }
// }
// const getOneByName = async (name) => {
//     const foundItem = await db.shop.findOne(
//         {
//             name: {
//                 '$regex': `^${name}$`,
//                 '$options': 'i'
//             }
//         }
//     );
//     if (!foundItem) throw new Error(`Item with name '${name}' does not exist`);
//     return foundItem;
// }

// const updateOne = async (object) => {
//     try {
//         const updatedItem = await db.shop.updateOne(
//             {
//                 name: { $eq: object.name }
//             },
//             {
//                 $set: {
//                     'description': object.description,
//                     'img': object.img,
//                     'price': object.price,
//                     'qty': object.qty
//                 }
//             }, {
//             returnOriginal: false
//         });
//         return updatedItem;
//     } catch (err) {
//         throw new Error(`Due to ${err.message}, you are not allowed to insert this item ${JSON.stringify(object)}`);
//     }
// }

// const deleteOne = async (name) => {
//     try {
//         const deletedItem = await db.shop.deleteOne(
//             {
//                 name: { $eq: name }
//             },
//         );
//         return deletedItem;
//     } catch (err) {
//         throw new Error(`Due to ${err.message}, you are not allowed to delete this item ${JSON.stringify(name)}`);
//     }
// }

module.exports = {
    login(req, res) {
        res.render('leave/login', {});
    },
    resetPasswordForm(req, res) {
        res.render('leave/reset', {});
    },
    findUserForm(req, res) {
        res.render('leave/findUser', {})
    },
    find(req, res) {
        console.log(req.body);
        res.redirect('/');
    },
    checkLogin(req, res) {
        console.log(req.body.username, req.body.password);
        res.redirect('/' + req.body.username);
    },
    resetPassword(req, res) {
        //res.alert
        res.render('/', {});
    },
    async dash(req, res) {
        try {
            let ID = req.params.employeeID;
            let [user] = await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray();
            let subUserTicket = await getSubUser(user.subordinate);
            momentifyTicketDate(user.tickets);
            momentifyTicketDate(subUserTicket);
            res.render('leave/dashboard', { employeeID: ID, data: user, subUserData: subUserTicket })
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    view(req, res) {
        res.render('leave/view', {})
    },
    apply(req, res) {
        res.render('leave/application', {})
    },
    async applicationSubmit(req, res) {
        try {
            let ID = req.params.employeeID;
            let [user] = await findUserByID(ID);
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
            let { lastErrorObject } = await insertTicket(ID, ticket);
            if (!lastErrorObject.n) throw new Error('insertion failure');
            res.redirect('/' + ID);
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    async edit(req, res) {
        let ID = req.params.employeeID;
        let [user] = await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray();
        let index = req.params.ticketIndex;
        let ticketData = user.tickets[index];
        momentifyDateInObject(ticketData);
        res.render('leave/edit', { data: ticketData, userID: ID, ticketIndex: index });
    },
    async submitEdit(req, res) {
        try {
            let ID = req.params.employeeID;
            let [user] = await db.employeeLeave.find({ "_id": new ObjectId(ID) }).toArray();
            let index = req.params.ticketIndex;
            let info = req.body;
            if ( user.tickets[index].applicationStatus === "Approved" || user.tickets[index].applicationStatus === "Rejected" ) {
                info.applicationStatus = "Pending";
            }
            info.lastUpdatedDate = new Date();
            info.leaveStart = new Date(info.leaveStart);
            info.leaveEnd = new Date(info.leaveEnd);
            if (info.leaveType === user.tickets[index].leaveType && info.leaveStart.getTime() === user.tickets[index].leaveStart.getTime() && info.leaveEnd.getTime() === user.tickets[index].leaveEnd.getTime() && info.leaveReason === user.tickets[index].leaveReason) {
                res.redirect('/' + ID);
            } else {
                let { modifiedCount } = await updateTicket(ID, index, info);
                if (!modifiedCount) {
                    throw new Error('update failure');
                } else {
                    res.redirect('/' + ID);
                }
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
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