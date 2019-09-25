'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = 'localhost:8000';

chai.use(chaiHttp);

describe('GET /tutors', () => {
    it('All tutors', (done) => {
        chai.request(server)
        .get('/tutors')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            done();
        });
    });
});

describe('GET /tutors?topic=<topic>', () => {
    it('Topic with existing tutors', (done) => {
        let topic = encodeURIComponent('Ecuaciones Diferenciales');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            done();
        });
    });

    it('Nonexistent topic', (done) => {
        let topic = encodeURIComponent('Rafa');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            done();
        });
    });

    it('Topic without tutors', (done) => {
        let topic = encodeURIComponent('Smash Avanzado');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            done();
        });
    });

    it('Topic too long', (done) => {
        let topic = encodeURIComponent('extremely long topic string that should be rejected because it is just really dumb to have something this long to query for when using a simple thing such as a topic search string so it makes no sense at all to have this extremely long topic query string.');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(1);
            done();
        });
    });

    it('Max length topic', (done) => {
        let topic = encodeURIComponent('extremely long topic string that should be rejected because it is just really dumb to have something this long to query for when using a simple thing such as a topic search string so it makes no sense at all to have this extremely long topic query string');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array');
            done();
        });
    });
});
