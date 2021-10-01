/* global it describe before */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const HTMLParser = require('node-html-parser');

const server = require('../app.js');
var assert = require("assert");
chai.should();

const database = require("../db/database.js");
const collectionName = "editor";

chai.use(chaiHttp);

let token = "";
let _id = "";

describe('User_data', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /data', () => {
        it('Adding one file', (done) => {
            let file = {
                filename: "test3",
                content: "This is test3 from unittest!"
            };

            chai.request(server)
                .post("/data")
                .send(file)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property("filename");
                    res.body.should.have.property("content");
                    assert.equal(res.body.filename, "test3");
                    done();
                });
        });

        it('Adding another file', (done) => {
            let file = {
                filename: "test4",
                content: "This is test4 from unittest!"
            };

            chai.request(server)
                .post("/data")
                .send(file)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property("filename");
                    res.body.should.have.property("content");
                    assert.equal(res.body.filename, "test4");
                    done();
                });
        });

        it('Getting all the files', (done) => {
            chai.request(server)
                .get("/data")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    done();
                });
        });

        it('Getting one file', (done) => {
            chai.request(server)
                .get("/data/test3")
                .end((err, res) => {
                    res.body.should.be.an("object");
                    res.body.should.have.property("filename");
                    res.body.should.have.property("content");
                    assert.equal(res.body.filename, "test3");
                    done();
                });

        });

        it('Updating one file', (done) => {
            let file = {
                filename: "test3",
                content: "This has been updated!"
            };

            chai.request(server)
                .put("/data")
                .send(file)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("filename");
                    res.body.should.have.property("content");
                    assert.equal(res.body.content, "This has been updated!");
                    done();
                });
        });

        it('Deleting one file', (done) => {
            let file = {
                filename: "test3",
            };

            chai.request(server)
                .delete("/data")
                .send(file)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });

        it('Deleting one file which does not exist', (done) => {
            let file = {
                filename: "hello",
            };

            chai.request(server)
                .delete("/data")
                .send(file)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
