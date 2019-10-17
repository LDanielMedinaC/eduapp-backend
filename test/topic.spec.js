const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();


const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);

/*
* Test POST to /topics
*/
describe('POST /topics', () => {
    it('Should create topic', (done) => {
        let topic = {
            Name: 'Topic name',
            Field: 'Topic field'
        };
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Name');
            res.body.should.have.property('Field');
            res.body.Name.should.be.eql('Topic name');
            res.body.Field.should.be.eql('Topic field');
            done();
        });
    });

    it('No name', (done) => {
        let topic = {
            Field: 'Topic field'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });

    it('Name too long', (done) => {
        let topic = {
            Name: 'abcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijk',
            Field: 'Topic field'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_LENGTH)
        });
    });

    it('No field', (done) => {
        let topic = {
            Name: 'Topic name'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });
    });


    it('Should get topics', (done) => {
        chai.request(server)
        .get('/topics')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            done();
        });
    });

});