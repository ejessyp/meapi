const database = require("../db/database.js");

const data = {
    getAll: async function (res, req) {
        // req contains user object set in checkToken middleware
        let db;
        let str = eval("/" + req.user.email + "/");

        console.log(str);
        let filter = { $or: [{ "owner": req.user.email }, { "allowed": { "$regex": str } }] };

        try {
            db = await database.getDb();
            const result = await db.collection.find(filter).toArray();

            console.log(result);
            return res.json(result);
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    path: "/data",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    getOne: async function (res, req) {
        if (req.params.filename) {
            let filter = {
                "filename": req.params.filename
            };

            let db;

            try {
                db = await database.getDb();
                const result = await db.collection.findOne(filter);

                await db.collection.findOne(filter);

                return res.json(result);
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "Get /data/:filename ",
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
                    path: "Get /data no filename",
                    title: "No filename",
                    message: "No data id provided"
                }
            });
        }
    },

    createData: async function (res, req) {
        let db;

        try {
            db = await database.getDb();
            const data = {
                "filename": req.body.filename,
                "content": req.body.content,
                "owner": req.user.email,
                "mode": req.body.mode
            };

            console.log(data);
            const result = await db.collection.insertOne(data);

            if (result) {
                return res.status(201).json(data);
            }
        } catch (e) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "POST /data INSERT",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    updateData: async function (res, req) {
        // req contains user object set in checkToken middleware
        if (req.body.filename) {
            let filter = {
                "filename": req.body.filename
            };

            let db;

            try {
                db = await database.getDb();

                // eslint-disable-next-line max-len
                const result = await db.collection.findOneAndUpdate(filter, { $set: { "content": req.body.content, "mode": req.body.mode } },
                    { returnDocument: "after" });

                return res.json(result.value);
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

    updateAllowed: async function (res, req) {
        // req contains user object set in checkToken middleware
        if (req.body.filename) {
            let filter = {
                "filename": req.body.filename
            };

            let db;

            try {
                db = await database.getDb();

                // eslint-disable-next-line max-len
                const result = await db.collection.findOneAndUpdate(filter, { $addToSet: { "allowed": req.body.allowed } },
                    { returnDocument: "after" });

                console.log(result.value);
                return res.json(result.value);
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

    deleteData: async function (res, req) {
        // req contains user object set in checkToken middleware

        if (req.body.filename) {
            let filter = {
                "filename": req.body.filename
            };

            let db;

            try {
                db = await database.getDb();

                const result = await db.collection.deleteOne(filter);

                console.log("delete file", result);

                if (result.deletedCount === 1) {
                    return res.status(204).send();
                } else {
                    return res.status(404).send();
                }
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "DELETE /data/filename",
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
                    path: "DELETE /data no filename",
                    title: "No filename",
                    message: "No filename provided"
                }
            });
        }
    }

};

module.exports = data;
