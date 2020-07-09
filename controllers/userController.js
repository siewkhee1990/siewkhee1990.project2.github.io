const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('../controllers/repositoryController');
const bcrypt = require('bcrypt');
const SALT_ROUND = process.env.SALT_ROUND || 10;

module.exports = {
    register(req, res) {
        res.render('user/register');
    },
    async userCreate(req, res) {
        let data = req.body;
        console.log(data.username);
        try {
            let result = await repositoryController.findUserbyIC(data.nric);
            let existingUser = await repositoryController.checkExistingUser(data.nric);
            let checkUsername = await repositoryController.checkUsername(data.username);
            if (result.length !== 1) {
                throw new Error('Your company has not register you as an employee yet. Please contact your HR for further undertakings.');
            } else if (existingUser.length >= 1) {
                throw new Error('This user has already been registered.');
            } else if (checkUsername.length >= 1) {
                throw new Error('Username has been taken. Please use another username.');
            } else if (result.length === 1) {
                result = result[0];
                data.uID = result._id;
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
    login(req, res) {
        res.render('user/login', {});
    },
    resetPasswordForm(req, res) {
        res.render('user/reset', {});
    },
    findUserForm(req, res) {
        res.render('user/findUser', {})
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
        res.render('/', {});
    }
}