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

const validStudy = {
    institution: 'MIT',
    degree: 'Master',
    field: 'Aerospace Engineering',
    grade: 90,
    startDate: new Date('2011-07-14').toISOString(),
    endDate: new Date('2013-12-06').toISOString(),
    proofDocURL: 'https://storage.provider.com/items/asd78we231',
    validationDate: new Date('2019-06-12').toISOString()
};

describe('STUDIES', () => {
    let tutor;
    let noStudiesTutor;
    let id;
    let noStudiesId;
    let mockStudy;
    let mockStudyId;
    let postedStudyId;

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
            mockStudy = tutor.tutorDetails.studies[0];
            mockStudyId = mockStudy._id;
            delete mockStudy._id;

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
    
        it('No tutor id', (done) => {
            let tutorId = '';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid tutor id', (done) => {
            let tutorId = 'abc';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });
    
        it('Tutor not found', (done) => {
            // Id is a GUID, virtually impossible to generate twice
            let tutorId = '5d8d95289f4e1b152e7f84ed';
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });

    });
    
    /*
    * Test get study
    * GET /tutors/:tutorId/studies/:id
    * Should not be needed since GET /tutors/:tutorId already includes studies
    */
    describe('GET /tutors/:tutorId/studies/:studyId', () => {
       it('Should get study', (done) => {
           let tutorId = id;
           let studyId = mockStudyId;

            console.log(`/tutors/${tutorId}/studies/${studyId}`);
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.an('object');
               res.body.should.contain(mockStudy);

               done();
            });
       });

       it('No tutor id', (done) => {
            let tutorId = '';
            let studyId = mockStudyId;
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid tutor id', (done) => {
            let tutorId = 'abc';
            let studyId = mockStudyId;
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });
    
        it('Tutor not found', (done) => {
            // Id is a GUID, virtually impossible to generate twice
            let tutorId = '5d8d95289f4e1b152e7f84ed';
            let studyId = mockStudyId;
    
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });

        // Should get all studies
        it('No study id', (done) => {
            let studyId = '';
            let tutorId = id;
 
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array').that.is.not.empty;
                done();
            });
        });

        it('Invalid study id', (done) => {
            let studyId = 'asd';
            let tutorId = id;
 
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });
 
        it('Study not found', (done) => {
            let studyId = '56cb91bdc3464f14678934c9';
            let tutorId = id;
 
            chai.request(server)
            .get(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });
    });
    
    /*
    * Test create study
    * POST /tutors/:id/studies
    * Should not be needed since PUT /tutors/:id can update studies
    */
    describe('POST /tutors/:id/studies', () => {
        it('Should create study', (done) => {
            let tutorId = noStudiesId;
            let study = { ...validStudy };

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
                postedStudyId = postedStudy._id;
                expect(postedStudy).to.include(study);

                done();
            });
            
        });

        it('No tutor id', (done) => {
            let tutorId = '';
            let study = { ...validStudy };
    
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('code');
                res.body.error.code.should.be.eql(0);
    
                done();
            });
        });

        it('Invalid tutor id', (done) => {
            let tutorId = 'abc';
            let study = { ...validStudy };
    
            console.log(`/tutors/${tutorId}/studies`);
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });
    
        it('Tutor not found', (done) => {
            // Id is a GUID, virtually impossible to generate twice
            let tutorId = '5d8d95289f4e1b152e7f84ed';
            let study = { ...validStudy };
    
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });

        it('No study', (done) => {
            let tutorId = id;

            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('No institution', (done) => {
            let tutorId = noStudiesId;
            let study = { ...validStudy }

            delete study.institution;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Institution too short', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.institution = 'A';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('No degree', (done) => {
            let tutorId = noStudiesId;
            let study = { ...validStudy };

            delete study.degree;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Degree too short', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.degree = 'A';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('No field', (done) => {
            let tutorId = noStudiesId;
            let study = { ...validStudy };

            delete study.field;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Field too short', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.field = 'A';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('No grade', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            delete study.grade;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Grade is not an integer', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.grade = .5;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
            });
        });

        it('Grade is longer than 2 digits', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.grade = 100;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_LENGTH);
            });
        });

        it('No startDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            delete study.startDate;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Invalid startDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.startDate = 'asd';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });

        it('No endDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            delete study.endDate;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Invalid endDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.endDate = 'asd';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });

        it('startDate equals endDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.startDate = study.endDate;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.DATE_ORDER);
            });
        });

        it('startDate is after endDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            let tempDate = study.startDate;
            study.startDate = study.endDate;
            study.endDate = tempDate;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.DATE_ORDER);
            });
        });

        it('No validationDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            delete study.validationDate;
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Invalid validationDate', (done) => {
            let tutorId = id;
            let study = { ...validStudy };

            study.validationDate = 'asd';
            chai.request(server)
            .post(`/tutors/${tutorId}/studies`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });
    });
    
    /*
    * Test update study
    * PATCH /tutors/:id/studies
    * Should not be needed since PUT /tutors/:id can update studies
    */
    describe('PATCH /tutors/:tutorId/studies/:studyId', () => {
        it('No tutorId', (done) => {
            let tutorId = '';
            let studyId = mockStudyId;
    
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid tutorId', (done) => {
            let tutorId = 'asd';
            let studyId = mockStudyId;

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });

        it('No studyId', (done) => {
            let tutorId = id;
            let studyId = '';

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid studyId', (done) => {
            let tutorId = id;
            let studyId = 'asd';

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID)
            })
        });

        it('Tutor does not exist', (done) => {
            let tutorId = mockStudyId;
            let studyId = mockStudyId;
            let study = { ...validStudy };

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeNotFound(res, done, Errors.OBJECT_NOT_FOUND)
            })
        });

        it('Study does not exist', (done) => {
            let tutorId = id;
            let studyId = id;
            let study = { ...validStudy };

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeNotFound(res, done, Errors.OBJECT_NOT_FOUND)
            })
        });

        it('No study', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD)
            })
        });

        it('Institution too short', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.institution = 'a';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });
        
        it('Degree too short', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.degree = 'a';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('Field too short', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.field = 'a';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('Invalid grade (type)', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.grade = 9.6;
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
            });
        });

        it('Invalid grade (length)', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.grade = 100;
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_LENGTH);
            });
        });

        it('Invalid startDate', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.startDate = 'asd';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });

        it('Invalid endDate', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.endDate = 'asd';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });

        it('Invalid validationDate', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.validationDate = 'asd';
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ENCODING);
            });
        });

        it('startDate equals endDate', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.startDate = new Date('2019-01-01');
            study.endDate = study.startDate;
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.DATE_ORDER);
            });
        });

        it('Wrong start-end dates order', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.startDate = new Date('2019-01-10');
            study.endDate = new Date('2019-01-01');
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.DATE_ORDER);
            });
        });

        it('validationDate equals endDate', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.startDate = new Date('2019-01-01');
            study.endDate = new Date('2019-01-10');
            study.validationDate = study.endDate;
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                res.should.have.status(200);
                study.startDate = study.startDate.toISOString();
                study.endDate = study.endDate.toISOString();
                study.validationDate = study.validationDate.toISOString();
                res.body.should.contain(study);
                done();
            });
        });

        it('Wrong validationDate order', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.startDate = new Date('2019-01-01');
            study.endDate = new Date('2019-01-10');
            study.validationDate = new Date('2019-01-05');
            
            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                shouldBeError(res, done, Errors.DATE_ORDER);
            });
        });

        it('Update study', (done) => {
            let tutorId = id;
            let studyId = mockStudyId;
            let study = { ...validStudy };
            study.institution = 'Tecnológico de Chapingo';

            chai.request(server)
            .patch(`/tutors/${tutorId}/studies/${studyId}`)
            .send(study)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.contain(study);
                done();
            });            
        });
    });
    
    /*
    * Test delete study
    * DELETE /tutors/:tutorId/studies/:id
    * Should not be needed since PUT /tutors/:id can update studies
    */
    describe('DELETE /tutors/:tutorId/studies/:id', () => {
        it('Should delete study', (done) => {
            let tutorId = noStudiesId;
            let route = `/tutors/${tutorId}/studies/${postedStudyId}`;
            console.log(route);

            chai.request(server)
            .delete(route)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('tutorDetails');
                res.body.tutorDetails.should.have.property('studies');
                res.body.tutorDetails.studies.should.be.an('array').that.is.empty;

                done();
            });
        });

        it('No tutor id', (done) => {
            let tutorId = '';

            console.log(`/tutors/${tutorId}/studies/${postedStudyId}`);
            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${postedStudyId}`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid tutor id', (done) => {
            let tutorId = 'abc';

            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${postedStudyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });

        it('Tutor not found', (done) => {
            let tutorId = '56cb91bdc3464f14678934ca';

            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${postedStudyId}`)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });

        it('No study id', (done) => {
            let tutorId = id;
            let studyId = '';

            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, 0);
            });
        });

        it('Invalid study id', (done) => {
            let tutorId = id;
            let studyId = 'abc';

            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_ID);
            });
        });

        it('Study not found', (done) => {
            let tutorId = id;
            let studyId = '56cb91bdc3464f14678934c9';

            console.log(`/tutors/${tutorId}/studies/${studyId}`);
            chai.request(server)
            .delete(`/tutors/${tutorId}/studies/${studyId}`)
            .end((err, res) => {
                shouldBeNotFound(res, done);
            });
        });
    });
    
});
