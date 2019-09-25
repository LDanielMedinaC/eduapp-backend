'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = 'localhost:8000';

chai.use(chaiHttp);

describe('GET /tutors', () => {
    it('Should return tutors', (done) => {
        let topic = encodeURIComponent('Ecuaciones Diferenciales');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            done();
        });
    });

    it('Should return empty array', (done) => {
        let topic = encodeURIComponent('Rafa');

        chai.request(server)
        .get(`/tutors?topic=${topic}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            done();
        });
    });
});
