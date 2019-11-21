const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const _ = require("lodash");

const server = 'localhost:8000';
const db = require('../server/models');
const User = require('../server/models').User;
const tutors = require('../mock/tutors');

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);

let validPayAccount1 = {
    method: 'cash'
}
let validPayAccount2 = {
    method: 'debit card'
}
let validPayAccount3 = {
    method: 'credit card'
}
let validPayAccount4 = {
    method: 'paypal'
}

let invalidPayAccount1 = {
    method: 'cash$'
}
let invalidPayAccount2 = {
    method: 'debit-card'
}
let invalidPayAccount3 = {
    method: 'credit_card'
}
let invalidPayAccount4 = {
    method: 'pay&pal'
}


describe('PaymentAccount POST', () => {

    let tutor;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Valid POST 1', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(validPayAccount1)
        .end((err, res) => {

            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Valid POST 2', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(validPayAccount2)
        .end((err, res) => {

            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Valid POST 3', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(validPayAccount3)
        .end((err, res) => {

            res.should.have.status(201);
            res.body.should.be.an('object');


            done();
        });

    });

    it('Valid POST 4', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(validPayAccount4)
        .end((err, res) => {

            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Invalid POST 1', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(invalidPayAccount1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });

    it('Invalid POST 2', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(invalidPayAccount2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });

    it('Invalid POST 3', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(invalidPayAccount3)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });

    it('Invalid POST 4', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send(invalidPayAccount4)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });

    it('Invalid POST - Empty object', (done) => {

        chai.request(server)
        .post(`/tutors/${tutor._id}/paymentAccounts`)
        .send({})
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .post(`/tutors/qwerty/paymentAccounts`)
        .send(validPayAccount1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {

        chai.request(server)
        .post(`/tutors/ffffffffffffff0123456789/paymentAccounts`)
        .send(validPayAccount1)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

});

describe('PaymentAccount GET:id', () => {

    let tutor;
    let paymentAcc;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            paymentAcc = tutor.tutorDetails.paymentAccounts[0];

            paymentAcc._id = paymentAcc._id.toString('hex');

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .get(`/tutors/qwerty/paymentAccounts/${paymentAcc._id}`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .get(`/tutors/ffffffffffffff0123456789/paymentAccounts/${paymentAcc._id}`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Invalid paymentAccount ID', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentAccounts/qwerty`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('paymentAccount not found', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentAccounts/ffffffffffffff0123456789`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Valid and correct get', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentAccounts/${paymentAcc._id}`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('method');

            _.isEqual(res.body, paymentAcc).should.be.eql(true);
            
            done();
        });

    });

});

describe('PaymentAccount GET', () => {

    let tutor;
    let noPATutor;
    let paymentAccs;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            paymentAccs = tutor.tutorDetails.paymentAccounts;

            console.log(paymentAccs);

            for (let pa of paymentAccs)
            {
                pa._id = pa._id.toString('hex');
            }

            noPATutor = await User.findOne({ 'email': tutors[1].email }).exec();

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .get(`/tutors/qwerty/paymentAccounts`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .get(`/tutors/ffffffffffffff0123456789/paymentAccounts`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });


    it('Correct get of all payment Accounts', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentAccounts`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            
            _.isEqual(res.body, paymentAccs).should.be.eql(true);
            
            done();
        });

    });

    it('Correct get of no payment accounts', (done) => {

        chai.request(server)
        .get(`/tutors/${noPATutor._id}/paymentAccounts`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            
            _.isEqual(res.body, []).should.be.eql(true);
            
            done();
        });

    });

});