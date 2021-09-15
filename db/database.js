// MongoDB
const mongo = require("mongodb").MongoClient;

const collectionName = "files";

const database = {
    getDb: async function getDb () {

        let dsn;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }  else {
            const config = require("./config.json");
            dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.pwqp2.mongodb.net/editor?retryWrites=true&w=majority`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
