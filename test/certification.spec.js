const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

const server = 'localhost:8000';
const db = require('../server/models');
const User = require('../server/models').User;
const tutors = require('../mock/tutors');

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);


describe('Tutor Certification POST', () => {

    let dbTutor;
    let noCertTutor;
    before(done => {
        db.connectDB()
        .then(async () => {

            dbTutor = await User.findOne({ 'email': tutors[0].email }).exec();
            noCertTutor = await User.findOne({ 'email': tutors[1].email }).exec();

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    let validCertificationNoDiploma = {
        institution: 'Oracle Academy',
        title: 'Java Fundamentals',
        date: new Date('2015-12-08').toISOString(),
    }
    let validCertificationWDiploma = {
        institution: 'Oracle Academy',
        title: 'Database Design',
        date: new Date('2016-01-10').toISOString(),
        diplomaURL: 'https::storage.container.com/867348dfj'
    }

    it('Valid certification POST no diploma', (done) => {

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(validCertificationNoDiploma)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;

            done();
        });

    });

    it('Valid certification POST w diploma', (done) => {

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(validCertificationWDiploma)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;

            done();
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .post(`/tutors/qwerty/certifications`)
        .send(validCertificationNoDiploma)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .post(`/tutors/ffffffffffffff0123456789/certifications`)
        .send(validCertificationNoDiploma)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Failed insert: no institution', (done) => {

        let noInstCert = {...validCertificationWDiploma};
        delete noInstCert.institution;

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(noInstCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: no title', (done) => {

        let noTitleCert = {...validCertificationWDiploma};
        delete noTitleCert.title;

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(noTitleCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: no date', (done) => {

        let noDateCert = {...validCertificationWDiploma};
        delete noDateCert.date;

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(noDateCert)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);

        });

    });

    it('Failed insert: institution too short', (done) => {

        let certCopy = {...validCertificationWDiploma};
        certCopy.institution = "l";

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);

        });

    });

    it('Failed insert: title too short', (done) => {

        let certCopy = {...validCertificationWDiploma};
        certCopy.title = "l";

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);

        });

    });

    it('Failed insert: date wrong format', (done) => {

        let certCopy = {...validCertificationWDiploma};
        certCopy.date = "1999-30-15";

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FORMAT);

        });

    });

    it('Failed insert: date is in the future', (done) => {

        let certCopy = {...validCertificationWDiploma};
        certCopy.date = new Date();
        certCopy.date.setDate(certCopy.date.getDate() + 1);

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.DATE_ORDER);

        });

    });

    it('Failed insert: diploma url is invalid', (done) => {

        let certCopy = {...validCertificationWDiploma};
        certCopy.diplomaURL = 'agjkgjadk';

        chai.request(server)
        .post(`/tutors/${noCertTutor._id}/certifications`)
        .send(certCopy)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_URL);

        });

    });

});