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
        let topic = encodeURIComponent('Cálculo Vectorial');

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

    it('Topic too short', (done) => {
        chai.request(server)
        .get('/tutors?topic=')
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2);
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

describe('GET /tutors/:id', () => {

    it('Invalid ID', (done) => {
       
        let id = '000';
 
         chai.request(server)
         .get('/tutors/'+id)
         .end((err, res) => {
             res.should.have.status(400);
             res.body.error.code.should.be.eql(2);
             done();
         });
     });

    it('Given ID is not a tutor', (done) => {
       
       let id = '555555555555551d35198a31';

        chai.request(server)
        .get('/tutors/'+id)
        .end((err, res) => {
            res.should.have.status(404);
            res.body.error.code.should.be.eql(3);
            done();
        });
    });

    it('Succesful get of a tutor', (done) => {
    
        chai.request(server)
        .get('/tutors/')
        .end((err, res) => {

            let id = res.body[0]._id;
            
            chai.request(server)
            .get('/tutors/' + id)
            .end((err2, res2) => {
                res2.should.have.status(200);
                done();
            });
        });
     });
});