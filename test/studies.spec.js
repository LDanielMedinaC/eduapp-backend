const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();
const expect = chai.expect;
const User = require('../server/models').User;
const tutors = require('../mock/tutors');
const db = require('../server/models');

chai.use(chaiHttp);

describe('STUDIES', () => {
    let tutor;
    let noStudiesTutor;
    let id;
    let noStudiesId;

    before(done => {
        db.connectDB()
        .then(async () => {
            console.log('DB connected');
            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            noStudiesTutor = await User.findOne({ 'email': tutors[1].email }).exec();

            db.disconnectDB()
            console.log('DB disconnected');

            id = tutor._id;
            noStudiesId = noStudiesTutor._id;

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });
    
    /*
    * Test list studies
    * GET /tutors/:id/studies
    * Should not be needed since GET /tutors/:id already includes studies
    */
    describe('GET /tutors/:id/studies', () => {
        it('Should return studies', (done) => {
            let tutorId = id;
            console.log(`GET /tutors/${tutorId}/studies`);
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array').that.is.not.empty;
                done();
            });
    
        });
    
        it('Invalid id', (done) => {
            let tutorId = 'abc';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('code');
                res.body.error.code.should.be.eql(20);
    
                done();
            });
        });
    
        it('No id', (done) => {
            let tutorId = '';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('code');
                res.body.error.code.should.be.eql(0);
    
                done();
            });
        });
    
        it('Tutor not found', (done) => {
            // Id is a GUID, virtually impossible to generate twice
            let tutorId = '5d8d95289f4e1b152e7f84ed';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('code');
                res.body.error.code.should.be.eql(21);
    
                done();
            });
        })
    });
    
    /*
    * Test get study
    * GET /tutors/:tutorId/studies/:id
    * Should not be needed since GET /tutors/:tutorId already includes studies
    */
    
    /*
    * Test create study
    * POST /tutors/:id/studies
    * Should not be needed since PUT /tutors/:id can update studies
    */
    describe('POST /tutors/:id/studies', () => {
        it('Should create study', (done) => {
            let tutorId = noStudiesId;
            let study = {
                institution: 'MIT',
                degree: 'Master',
                field: 'Aerospace',
                grade: 90,
                startDate: new Date('2011-07-14').toISOString(),
                endDate: new Date('2013-12-06').toISOString(),
                proofDocURL: 'https://storage.provider.com/items/asd78we231',
                validationDate: new Date('2019-06-12').toISOString()
            };

            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                // Verify study was inserted
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('tutorDetails');
                res.body.tutorDetails.should.have.property('studies');
                res.body.tutorDetails.studies.should.be.an('array').that.is.not.empty;

                let postedStudy = res.body.tutorDetails.studies[0];
                expect(postedStudy).to.include(study);

                done();
            });
            
        });
    });
    
    /*
    * Test update study
    * PATCH /tutors/:id/studies
    * Should not be needed since PUT /tutors/:id can update studies
    */
    
    /*
    * Test delete study
    * DELETE /tutors/:tutorId/studies/:id
    * Should not be needed since PUT /tutors/:id can update studies
    */
    
});
