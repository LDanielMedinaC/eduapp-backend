'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

const server = 'localhost:8000';
const db = require('../server/models');

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);

/*
    Validate IDs
    Requires specifying which method is to be used. Values allowed: 'GET',
    'POST', 'PUT', 'DELETE'.
*/
const validateIds = (method, routePattern, validIds, payload = {}) => {
    const idParamRegex = /(:\w+Id)/;
    const idRegexGlobal = /(?:\:)(\w+Id)/g;
    const modelRegex = /(\w+)(?:Id)/;

    const chaiMethod = method.toLowerCase();
    const invalidId = 'abc';
    const mockId = '5ddb3f46a99603a30c89509e'; // GUID - Should not be generated twice

    const buildRoute = (id, idValue) => {
        let route = routePattern.replace(`:${id}`, idValue);
        for(let key in validIds)
            route = route.replace(`:${key}`, validIds[key].id || validIds[key]);

        return route;
    };

    // Parse id parameter names, populate array
    let ids = [];
    let newIdMatch;
    while(newIdMatch = idRegexGlobal.exec(routePattern))
        ids.push(newIdMatch[1]);

    // For each id to validate:
    //      - remove
    //      - replace for non-ObjectID
    //      - use not-found id
    for(let id of ids) {
        let model = modelRegex.exec(id)[1];

        // Test with id removed only if 'canBeMissing' is not enabled
        if(validIds[id] && !validIds[id].canBeMissing) {
            let route = buildRoute(id, '');

            it(`No ${model} id [${route}]`, (done) => {
                if(idParamRegex.test(route))
                    throw new Error(`Provided ids do not match route pattern: ${route}`);

                chai.request(server)
                [chaiMethod](route) // If this line fails you are using a not allowed HTTP method
                .end((err, res) => {
                    shouldBeError(res, done, Errors.ROUTE_ERROR);
                });
            });
        }

        // Test with non-ObjectID
        {
            let route = buildRoute(id, invalidId);

            it(`Invalid ${model} id [${route}]`, (done) => {
                chai.request(server)
                [chaiMethod](route) // If this line fails you are using a not allowed HTTP method
                .end((err, res) => {
                    shouldBeError(res, done, Errors.INVALID_ID);
                });
            });
        }

        // Test with not-found id
        {
            let route = buildRoute(id, mockId);

            it(`Non-existent ${model} id [${route}]`, (done) => {
                chai.request(server)
                [chaiMethod](route) // If this line fails you are using a not allowed HTTP method
                .send(payload)
                .end((err, res) => {
                    shouldBeNotFound(res, done, Errors.OBJECT_NOT_FOUND);
                });
            });
        }
    }
};

describe('SKILLS', () => {
    let mockTutorId = '5db48a252f3af03923defe82';
    let mockSkillId = '5de553854d21e64b51fcedee';
    const listPattern = '/tutors/:tutorId/skills';
    const getPattern = '/tutors/:tutorId/skills/:skillId';

    /*
    * Test list skills
    * GET /tutors/:tutorId/skills
    * Retrieve all skills for a tutor
    */
    describe(`GET ${listPattern}`, () => {
        validateIds('GET', listPattern, {
            tutorId: mockTutorId
        });

        it('List skills', (done) => {
            chai.request(server)
            .get(`/tutors/${mockTutorId}/skills`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array').that.is.not.empty;
                done();
            });
        });
    });

    /*
    * Test get skill details
    * GET /tutors/:tutorId/skills/:skillId
    * Retrieve tutor skill
    */
    describe(`GET ${getPattern}`, () => {
        validateIds('GET', getPattern, {
            tutorId: mockTutorId,
            skillId: {
                id: mockSkillId,
                canBeMissing: true
            }
        });

        it('Get skill object', (done) => {
            chai.request(server)
            .get(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('field');
                res.body.should.have.property('experience');
                done();
            });
        });
    });

    /*
    * Test create skill
    * POST /tutors/:tutorId/skills
    * Create skill for tutor
    */
    describe(`POST ${listPattern}`, () => {
        let validSkill = {
            name: 'Ecuaciones Diferenciales',
            field: 'Matemáticas',
            experience: 5
        };

        validateIds('POST', listPattern, {
            tutorId: mockTutorId
        }, validSkill);

        it('Missing skill object', (done) => {
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Missing name', (done) => {
            let payload = {...validSkill};
            delete payload.name;
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Missing field', (done) => {
            let payload = {...validSkill};
            delete payload.field;
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Missing experience', (done) => {
            let payload = {...validSkill};
            delete payload.experience;
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Name too short', (done) => {
            let payload = {...validSkill};
            payload.name = 'a';
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('Invalid topic field', (done) => {
            let payload = {...validSkill};
            payload.field = 'Gaming';
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_FIELD);
            });
        });

        it('Negative experience', (done) => {
            let payload = {...validSkill};
            payload.experience = -5;
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.NUMBER_LOWER_BOUND);
            });
        });

        it('Experience upper bound', (done) => {
            let payload = {...validSkill};
            payload.experience = 110;
            
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
            });
        });

        it('Create existing skill', (done) => {
            let payload = {...validSkill};
            payload.name = 'Álgebra Lineal';

            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.CLIENT_ERROR);
            });
        });

        it('Create skill (existing topic)', (done) => {
            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(validSkill)
            .end((err, res) => {
                try {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('field');
                    res.body.should.have.property('experience');
                    done();
                } catch(err) {
                    err.message += '\n';
                    err.message += JSON.stringify(res.body, null, 4);
                    throw err;
                }
            });
        });

        it('Create skill (new topic)', (done) => {
            let payload = {...validSkill};
            payload.name = 'Matemáticas Discretas';

            chai.request(server)
            .post(`/tutors/${mockTutorId}/skills`)
            .send(payload)
            .end((err, res) => {
                try {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('field');
                    res.body.should.have.property('experience');
                    done();
                } catch(err) {
                    err.message += '\n';
                    err.message += JSON.stringify(res.body, null, 4);
                    throw err;
                }
            });
        });
    });

    /*
    * Test update skill
    * PUT /tutors/:tutorId/skills/:skillId
    * Updates provided fields for skill with id in parameter
    */
    describe(`PUT ${getPattern}`, () => {
        let validSkill = {
            name: 'Ecuaciones Diferenciales',
            field: 'Matemáticas',
            experience: 5
        };

        validateIds('PUT', getPattern, {
            tutorId: mockTutorId,
            skillId: {
                id: '5db88a888f8af88888defe88',
                canBeMissing: true
            }
        }, validSkill);

        it('Missing skill object', (done) => {
            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .end((err, res) => {
                shouldBeError(res, done, Errors.MISSING_FIELD);
            });
        });

        it('Name too short', (done) => {
            let payload = {...validSkill};
            payload.name = 'a';
            
            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.SHORT_STRING);
            });
        });

        it('Invalid topic field', (done) => {
            let payload = {...validSkill};
            payload.field = 'Gaming';
            
            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.INVALID_FIELD);
            });
        });

        it('Negative experience', (done) => {
            let payload = {...validSkill};
            payload.experience = -5;
            
            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.NUMBER_LOWER_BOUND);
            });
        });

        it('Experience upper bound', (done) => {
            let payload = {...validSkill};
            payload.experience = 110;
            
            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
            });
        });

        it('Update skill (unmodified)', (done) => {
            let payload = {
                name: 'Álgebra Lineal',
                field: 'Matemáticas',
                experience: 10
            };

            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('field');
                res.body.should.have.property('experience');
                res.body.name.should.be.eql(payload.name);
                done();
            });
        });

        it('Update skill (existing topic)', (done) => {
            let payload = {...validSkill};
            payload.name = 'Calculo Vectorial';

            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('field');
                res.body.should.have.property('experience');
                res.body.name.should.be.eql(payload.name);
                done();
            });
        });

        it('Update skill (new topic)', (done) => {
            let payload = {...validSkill};
            payload.name = 'Matemáticas Computacionales';

            chai.request(server)
            .put(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .send(payload)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('field');
                res.body.should.have.property('experience');
                res.body.name.should.be.eql(payload.name);
                done();
            });
        });
    });

    /*
    * Test update skill
    * PUT /tutors/:tutorId/skills/:skillId
    * Updates provided fields for skill with id in parameter
    */
    describe(`DELETE ${getPattern}`, () => {
        validateIds('DELETE', getPattern, {
            tutorId: mockTutorId,
            skillId: {
                id: '5db88a888f8af88888defe88',
                canBeMissing: true
            }
        });

        it('Delete skill', (done) => {
            chai.request(server)
            .delete(`/tutors/${mockTutorId}/skills/${mockSkillId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');

                done();
            });
        });
    });
});
