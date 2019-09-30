const mongoose = require('mongoose');
const userController = require('../server/controllers').user;
const userModel = require('../server/models').user;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();

chai.use(chaiHttp);



describe('POST /tutorings', () => {
    let tutoring = {
        date: "10/11/2019",
        lat: 19.019635,
        long: -98.246918,
        locationType: 'Casa del tutor',
        locationName: 'Tutor\'s place',
        topicID: '5d8d49a56ee837016abcd2a7',
        tutorID: '5d8d49a96ee837016abcd2b1',
        userID: '5d8d49a56ee837016abcd2aa',
        startTime: "12:00",
        endTime: "23:00",
        notes: 'It\'s not the best student',
        paymentMethod: 'cash'
    };
    let attributeNames = ['date', 'lat','long','locationType', 'locationName', 'topicID', 'tutorID', 'userID','startTime', 'endTime', 'notes', 'paymentMethod']; 
    let attributesValue = [];
    it('shouldCreate a tutoring', () => {
        chai.request(server)
        .post('/tutorings')
        .send(tutoring)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            attributeNames.forEach(function(attributeName){
                res.body.should.have.property(attributeName);
            });
            res.body.date.should.be.eql('10/11/2019');
            res.body.lat.should.be.eql(19.019635);
            res.body.long.should.be.eql(-98.246918);
            res.body.locationType.should.be.eql('Casa del tutor');
            res.body.locationName.should.be.eql('Tutor\'s place');
            res.body.topicID.should.be.eql('5d8d49a56ee837016abcd2a7'); 
            res.body.tutorID.should.be.eql('5d8d49a96ee837016abcd2b1'); 
            res.body.userID.should.be.eql('5d8d49a56ee837016abcd2aa'); 
            res.body.startTime.should.be.eql('12:00'); 
            res.body.endTime.should.be.eql('23:00'); 
            res.body.notes.should.be.eql('It\'s not the best student'); 
            res.body.paymentMethod.should.be.eql('cash'); 
            done();
        });
    });

    it('No date was provided.', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.date; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(1); 
            done();
          });
      });

    it('Wrong date format.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.date = "19/20/4"; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2); 
            done();
        });
    });

    it('date provided is in the past.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.date = '10/3/1999'; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(3); 
            done();
        });
    });
    it('No time was provided', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.startTime; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(4); 
            done();
        });
    });
    it('wrong time format.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.startTime = '123:434'; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(5); 
            done();
        });
    });
    it('Start time should be before end time.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.startTime = '19:00'; 
        tutoringAux.endTime = '10:00'; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(6); 
            done();
        });
    });
    it('No location provided.', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.locationName; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(7); 
            done();
        });
    });
    it('Invalid coordinates.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.lat = 300.0; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(8); 
            done();
        });
    });
    it('Invalid location type.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.locationType = "Somewhere else"; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(9); 
            done();
        });
    });
    it('Location name should have more than 3 and less than 51 chars.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.locationName = "wy"; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(10); 
            done();
        });
    });
    it('No notes were provided', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.notes; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(11); 
            done();
        });
    });
    it('Location name should have more than 3 and less than 51 chars.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.notes = ""; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(12); 
            done();
        });
    });
    it('No payment method was provided.', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.paymentMethod; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(13); 
            done();
        });
    });
    it('Invalid payment method.', (done) => {
        let tutoringAux = tutoring;
        tutoringAux.paymentMethod = "Cupones de descuento"; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(14); 
            done();
        });
    });
    it('No topic provided', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.topicID; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(15); 
            done();
        });
    });
    it('No tutor provided', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.tutorID; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(16); 
            done();
        });
    });
    it('No user provided', (done) => {
        let tutoringAux = tutoring;
        delete tutoringAux.userID; 
        chai.request(server)
          .post('/tutorings')
          .send(tutoringAux)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(17); 
            done();
        });
    });
});