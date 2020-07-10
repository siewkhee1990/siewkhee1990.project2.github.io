const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('../controllers/repositoryController');
const bcrypt = require('bcrypt');
const SALT_ROUND = process.env.SALT_ROUND || 10;

module.exports = {
    login(req, res) {
        res.render('user/login', {});
    },
    register(req, res) {
        res.render('user/register');
    },
    async userCreate(req, res) {
        let data = req.body;
        try {
            let result = await repositoryController.findUserbyIC(data.nric.toUpperCase());
            let existingUser = await repositoryController.checkExistingUser(data.nric.toUpperCase());
            let checkUsername = await repositoryController.checkUsername(data.username.toUpperCase());
            if (result.length !== 1) {
                throw new Error('Your company has not register you as an employee yet. Please contact your HR for further undertakings.');
            } else if (existingUser.length >= 1) {
                throw new Error('This user has already been registered.');
            } else if (checkUsername.length >= 1) {
                throw new Error('Username has been taken. Please use another username.');
            } else if (result.length === 1) {
                result = result[0];
                data.uID = result._id;
                data.username = data.username.toUpperCase();
                data.nric = data.nric.toUpperCase();
                data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(SALT_ROUND));
            };
            let { insertedCount } = await repositoryController.createUser(data);
            if (!insertedCount) {
                throw new Error('User creation failed');
            } else {
                res.redirect('/');
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    resetPasswordForm(req, res) {
        res.render('user/reset', {});
    },
    async resetPassword(req, res) {
        let data = req.body;
        try {
            let [existingUser] = await repositoryController.checkUsername(data.username.toUpperCase());
            if (!existingUser) {
                throw new Error('Username not found.');
            } else if (existingUser.nric.toUpperCase() !== data.nric.toUpperCase()) {
                throw new Error('NRIC provided does not match the user.');
            } else if (data.password !== data.confirmedPassword) {
                throw new Error('Your new password do not match, please try again.');
            } else {
                data.username = data.username.toUpperCase();
                data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(SALT_ROUND));
                let { lastErrorObject } = await repositoryController.updatePassword(data);
                if (!lastErrorObject.n) throw new Error('update failure');
                res.redirect('/');
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    }
}