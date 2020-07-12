const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = 'mongodb+srv://siewkhee1990:ealtelaWjnTIP4aG@cluster0-yxebn.mongodb.net/test';
//process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'project';
const COLLECTIONS = {
    EMPLOYEELEAVE: 'employeeLeave',
    USER: 'user'
};

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

module.exports = {
    async connect () {
        const connection = await client.connect();
        console.log('Connected to MongoDB');
        const db = connection.db(DB_NAME);
        this.employeeLeave = db.collection(COLLECTIONS.EMPLOYEELEAVE);
        this.user = db.collection(COLLECTIONS.USER);
    },
    disconnect () {
        return client.close();
    },
};
