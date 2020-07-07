const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'project';
const COLLECTIONS = {
    EMPLOYEELEAVE: 'employeeLeave',
};

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

module.exports = {
    async connect () {
        const connection = await client.connect();
        console.log('Connected to MongoDB');
        const db = connection.db(DB_NAME);
        this.employeeLeave = db.collection(COLLECTIONS.EMPLOYEELEAVE);
    },
    disconnect () {
        return client.close();
    },
};
