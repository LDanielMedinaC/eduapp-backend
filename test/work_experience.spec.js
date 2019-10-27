const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const _ = require("lodash")

const server = 'localhost:8000';
const db = require('../server/models');
const User = require('../server/models').User;
const tutors = require('../mock/tutors');

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);

let workExpStillWorking = {
    institution: 'CD Project Red',
    department: 'Game Director',
    beginDate: new Date('2012-05-28').toISOString(),
    endDate: new Date('2020-08-17').toISOString(),
    stillWorking: true
}

let workExp = {
    institution: 'Lucid Inc.',
    department: 'Software Enginner Intern',
    beginDate: new Date('2019-05-28').toISOString(),
    endDate: new Date('2019-08-18').toISOString(),
    stillWorking: false
}

describe('WorkExp POST', () => {

    let dbTutor;
    let noWETutor;
    before(done => {
        db.connectDB()
        .then(async () => {

            dbTutor = await User.findOne({ 'email': tutors[0].email }).exec();
            noWETutor = await User.findOne({ 'email': tutors[1].email }).exec();

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Valid work exp POST stillWorking', (done) => {

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(workExpStillWorking)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Valid work exp POST not still working', (done) => {

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(workExp)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Correct insertion no "stillWorking" field', (done) => {

        let we = {
            institution: 'Google',
            department: 'Intern',
            beginDate: new Date('2019-01-01').toISOString(),
            endDate: new Date('2019-06-01').toISOString(),
        }

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(we)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');

            const returnedObj = {
                institution: res.body.institution,
                department: res.body.department,
                beginDate: res.body.beginDate,
                endDate: res.body.endDate,
                stillWorking: false
            }
            _.isEqual(returnedObj, we).should.be.eql(true);

            done();
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .post(`/tutors/qwerty/workexperiences`)
        .send(workExp)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {

        chai.request(server)
        .post(`/tutors/ffffffffffffff0123456789/workexperiences`)
        .send(workExp)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Failed insert: no institution', (done) => {

        let noInstCert = {...workExp};
        delete noInstCert.institution;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(noInstCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: no department', (done) => {

        let noTitleCert = {...workExp};
        delete noTitleCert.department;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(noTitleCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: no begin Date', (done) => {

        let noDateCert = {...workExp};
        delete noDateCert.beginDate;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(noDateCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: no end Date', (done) => {

        let noDateCert = {...workExp};
        delete noDateCert.endDate;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(noDateCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: endDate before beginDate (limit range)', (done) => {

        let we = {...workExp};
        we.beginDate = new Date('1990-04-12').toISOString();
        we.endDate = new Date('1990-04-11').toISOString();

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(we)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_ORDER);

        });
    });

    it('Failed insert: endDate before beginDate (lower range)', (done) => {

        let we = {...workExp};
        we.beginDate = new Date('1990-04-12').toISOString();
        we.endDate = new Date('1900-01-01').toISOString();

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(we)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_ORDER);

        });
    });

    it('Failed insert: endDate = beginDate', (done) => {

        let we = {...workExp};
        we.beginDate = new Date('1990-04-12').toISOString();
        we.endDate = new Date('1900-04-12').toISOString();

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(we)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_ORDER);

        });
    });

    it('Failed insert: institution too short', (done) => {

        let certCopy = {...workExp};
        certCopy.institution = "l";

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);

        });

    });

    it('Failed insert: department too short', (done) => {

        let certCopy = {...workExp};
        certCopy.department = "l";

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);

        });

    });

    it('Failed insert: beginDate wrong format', (done) => {

        let certCopy = {...workExp};
        certCopy.beginDate = "99/12/12";

        certCopy.stillWorking = true;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);

        });

    });

    it('Failed insert: endDate wrong format', (done) => {

        let certCopy = {...workExp};
        certCopy.endDate = "99/12/12";

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);

        });

    });

    it('Failed insert: beginDate invalid value', (done) => {

        let certCopy = {...workExp};
        certCopy.beginDate = '1999-200-200';

        certCopy.stillWorking = true;

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);

        });

    });

    it('Failed insert: endDate invalid value', (done) => {

        let certCopy = {...workExp};
        certCopy.endDate = '2020-200-100';

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);

        });

    });

    it('Failed insert: beginDate is in the future', (done) => {

        let certCopy = {...workExp};
        certCopy.beginDate = new Date();
        certCopy.beginDate.setDate(certCopy.beginDate.getDate() + 1);

        certCopy.endDate = new Date();
        certCopy.endDate.setDate(certCopy.beginDate.getDate() + 10);

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_IN_FUTURE);

        });

    });

    it('Failed insert: endDate is in the future', (done) => {

        let certCopy = {...workExp};

        certCopy.endDate = new Date();
        certCopy.endDate.setDate(certCopy.endDate.getDate() + 10);

        chai.request(server)
        .post(`/tutors/${dbTutor._id}/workexperiences`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_IN_FUTURE);

        });

    });


});