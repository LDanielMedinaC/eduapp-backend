'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = 'localhost:8000';

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const randomString = require('./helpers').randomString;

chai.use(chaiHttp);

const validFeedback = {
    name: 'Johnny Banana',
    email: 'johnny@banana.com',
    comment: 'EduApp is awesome!'
};

describe('POST /feedback', () => {
    it('No feedback', (done) => {
        chai.request(server)
        .post('/feedback')
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });

    it('No name', (done) => {
        let feedback = { ...validFeedback };
        delete feedback.name;

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });
    
    it('Name too short', (done) => {
        let feedback = { ...validFeedback };
        feedback.name = 'a';

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);
        });
    });

    it('Name too long', (done) => {
        let feedback = { ...validFeedback };
        feedback.name = randomString(128);

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });
    });

    it('Invalid name charset', (done) => {
        let feedback = { ...validFeedback };
        feedback.name = 'Örjan';

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_CHARSET);
        });
    });

    it('No email', (done) => {
        let feedback = { ...validFeedback };
        delete feedback.email;

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });

    it('Email too short', (done) => {
        let feedback = { ...validFeedback };
        feedback.email = 'ab';

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);
        });
    });

    it('Email too long', (done) => {
        let feedback = { ...validFeedback };
        feedback.email = randomString(321);

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });
    });

    it('Invalid email format', (done) => {
        let feedback = { ...validFeedback };
        feedback.email = 'invalid-address@';

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);
        });
    });

    it('No comment', (done) => {
        let feedback = { ...validFeedback };
        delete feedback.comment;

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });

    it('Comment too short', (done) => {
        let feedback = { ...validFeedback };
        feedback.comment = 'ab';

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);
        });
    });

    it('Comment too long', (done) => {
        let feedback = { ...validFeedback };
        feedback.comment = randomString(241);

        chai.request(server)
        .post('/feedback')
        .send(feedback)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });
    });

    it('Should send email', (done) => {
        chai.request(server)
        .post('/feedback')
        .send(validFeedback)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('Sent');

            done();
        });
    }).timeout(6000);
});
