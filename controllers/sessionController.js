const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('./repositoryController');
const bcrypt = require('bcrypt');
const SALT_ROUND = process.env.SALT_ROUND || 10;

module.exports = {
    async createSessions(req, res) {
        try {
            let data = req.body;
            const [user] = await repositoryController.checkUsername(data.username.toUpperCase());
            if (!user) {
                throw new Error('Username is not registered, please register before logging in.');
            } else if ( !bcrypt.compareSync(data.password, user.password) || data.username.toUpperCase() !== user.username.toUpperCase() ) {
                throw new Error('The username or password are incorrect. Please try again.')
            } else {
                req.session.currentUser = user;
                return res.redirect('/'+req.session.currentUser.uID);
            }
        } catch (err) {
            return res.render('errors/404', { err });
        }
    },
    destroy(req, res) {
        return req.session.destroy(() => {
            res.redirect('/');
        });
    }
}