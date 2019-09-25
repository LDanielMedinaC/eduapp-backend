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

describe('GET /tutors/:id', () => {

    it('Not existing user', (done) => {
       
       let id = '000';

        chai.request(server)
        .get('/tutors/' + id)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('User is not a tutor', (done) => {
       
        let id = '5d8b8c17dcd3c21d35198a31';
 
         chai.request(server)
         .get('/tutors/' + id)
         .end((err, res) => {
             res.should.have.status(400);
             res.body.error.code.should.be.eql(3);
             done();
         });
     });

    it('Succesful get of a tutor', (done) => {
    
        let id = '5d8b8c17dcd3c21d35198a37';
 
         chai.request(server)
         .get('/tutors/' + id)
         .end((err, res) => {
                res.should.have.status(200);
                done();
         });
     });
});