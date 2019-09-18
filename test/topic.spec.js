const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app')
const should = chai.should();

chai.use(chaiHttp);

/*
* Test POST to /topics
*/
describe('POST /topics', () => {
    it('Should create topic', () => {
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
        });
    });

    it('No name', () => {
        let topic = {
            Field: 'Topic field'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(1)
        });
    });

    it('Name too long', () => {
        let topic = {
            Name: 'abcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijkabcdefghijk',
            Field: 'Topic field'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('No field', () => {
        let topic = {
            Name: 'Topic name'
        }
        chai.request(server)
        .post('/topics')
        .send(topic)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(3)
        });
    });


    it('Name to long', () => {
        chai.request(server)
        .get('/topics')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
        });
    });

});