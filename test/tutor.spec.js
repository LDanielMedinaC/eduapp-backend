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
});
