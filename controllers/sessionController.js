const db = require('../db');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const repositoryController = require('./repositoryController');
const bcrypt = require('bcrypt');
const SALT_ROUND = process.env.SALT_ROUND || 10;

module.exports = {
    newForm(req, res) {

    },
    async createSessions(req, res) {
        try {
            let data = req.body;
            const [user] = await repositoryController.checkUsername(data.username);
            console.log (user);
            if (!user) {
                throw new Error('The username or password are incorrect')
            } else if (!bcrypt.compareSync(data.password, user.password)) {
                throw new Error('The username or password are incorrect')
            } else {
                req.session.currentUser = user;
                console.log(req.session);
                // return res.redirect('/'+req.session.currentUs);
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