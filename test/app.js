/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
// const HTMLParser = require('node-html-parser');

chai.should();

chai.use(chaiHttp);

describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Create pdf', (done) => {
            let content = "<strong>This is a test of pdf.</strong>";

            chai.request(server)
                .post("/pdf")
                .set('content-type', ' text/plain')
                .send(content)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Send email with sendgrid!', (done) => {
            let emailConfig = {
                to: "ejessyp@gmail.com",
                from: "qipa19@student.bth.se",
                subject: "Invitation of editing file ",
                template: "Please click to <a href=http://localhost:3000>Register</a>"
            };

            chai.request(server)
                .post("/send")
                .send(emailConfig)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
