const mongo = require("mongodb").MongoClient;
const collectionName = "files";

const files = [
    {
        fileName: "file1",
        content: "<p>this is another test!</p>",
        allowed: ["test@123.com","test5@123.com","test4@123.com",
            "test7@123.com", "test3@123.com", "test8@123.com", "test10@123.com"],
        owner: "test1@123.com"
    },
    {
        fileName: "file2",
        content: "<p>this is another test for file2!</p>",
        allowed: ["test1@123.com","test5@123.com","test4@123.com",
            "test7@123.com","test3@123.com","test8@123.com"],
        owner: "test@123.com"
    },
];



const dbGraphFile = {
    getDb: async function getDb() {
        // let dsn = `mongodb://localhost:27017/courses`;
        let dsn;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        } else {
            const config = require("./config.json");

            // eslint-disable-next-line max-len
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
    },

    resetCollection: async function resetCollection() {
        const db = await dbGraphFile.getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.collection.insertMany(files);
                await db.client.close();
            });
    }
};

module.exports = dbGraphFile;
