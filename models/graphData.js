// const collectionFile = require("../db/collection.json");
// collectionName =collectionFile.files;

const database = require("../db/dbGraphFile.js");

const graphData = {
    getAll: async function getAll(
        res=undefined,
    ) {
        let db;

        try {
            db = await database.getDb();

            let result = await db.collection.find({}).toArray();

            if (res === undefined) {
                return result;
            }
            return res.json({
                data: result
            });
        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
        }
    },

    deleteOne: async function deleteOne(res,
        filename
    ) {
        let db;
        let filter = {
            "filename": filename
        };

        try {
            db = await database.getDb();

            let result = await db.collection.deleteOne(filter);
            // if (res === undefined) {
            //     return result;
            // }

            if (result.deletedCount === 1) {
                return res.status(204).send();
            } else {
                return res.status(404).send();
            }

            // console.log(result);
            // return res.json({
            //     data: result
            // });
        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
        }
    },

    updateContent: async function (res, filename, content) {
        // req contains user object set in checkToken middleware
        if (filename) {
            let filter = {
                "filename": filename
            };

            let db;

            try {
                db = await database.getDb();

                // eslint-disable-next-line max-len
                const result = await db.collection.findOneAndUpdate(filter, { $set: { "content": content } },
                    { returnDocument: "after" });

                // return res.json(result.value);
                return result.value;
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "PUT /data UPDATE",
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "PUT /data no filename",
                    title: "No filename",
                    message: "No data id provided"
                }
            });
        }
    },

    updateAllowed: async function (res=undefined, filename, allowed) {
        // req contains user object set in checkToken middleware
        if (filename) {
            let filter = {
                "filename": filename
            };

            let db;

            try {
                db = await database.getDb();
                console.log(filter, allowed);
                // eslint-disable-next-line max-len
                const result = await db.collection.findOneAndUpdate(filter, { $addToSet: { "allowed": allowed } },
                    { returnDocument: "after" });
                // console.log(result.value);
                return result.value;
                // return res.json(result.value);
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "PUT /data/updateAllowed UPDATE",
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "PUT /data/allowed no filename",
                    title: "No filename",
                    message: "No data id provided"
                }
            });
        }
    },


    newFile: async function newFile(
        res, filename, content, owner
    ) {
        let db;

        try {
            db = await database.getDb();

            const data = {
                "filename": filename,
                "content": content,
                "owner": owner
            };

            // console.log(data);
            const result = await db.collection.insertOne(data);
            // console.log(result);
            // if (result) {
            //     return res.status(201).json(data);
            // }
            if (res === undefined) {
                return data;
            }

            return res.json({
                data: data
            });
        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
        }
    }
};

module.exports = graphData;
