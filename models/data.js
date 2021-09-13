const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function (res, req) {
        // req contains user object set in checkToken middleware
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.find({}).toArray();

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
        console.log(req.params.filename);
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

    createData: async function(res, req) {
        // req contains user object set in checkToken middleware
        // let apiKey = req.body.api_key;
        // let email = req.user.email;
        let db;

        try {
            db = await database.getDb();
            const data = {
                "filename": req.body.filename,
                "content": req.body.content
            }

            const result = await db.collection.insertOne(data);
            console.log(result);
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

                await db.collection.findOneAndUpdate(filter, {$set: {"content": req.body.content }},
                {
                    returnNewDocument: true
                });

                return res.status(204).send();
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

    deleteData: async function (res, req) {
        // req contains user object set in checkToken middleware
        if (req.body.filename) {

            let filter = {
                "filename": req.body.filename
            };

            let db;

            try {
                db = await database.getDb();

                await db.collection.deleteOne(filter);

                return res.status(204).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "DELETE /data DELETE",
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
                    message: "No filename provided"
                }
            });
        }
    }

};

module.exports = data;
