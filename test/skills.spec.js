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

    /*
    * Test list skills
    * GET /tutors/:tutorId/skills
    * Retrieve all skills for a tutor
    */
   const listPattern = '/tutors/:tutorId/skills';
    describe(`GET ${listPattern}`, () => {
        validateIds('GET', listPattern, {
            tutorId: '5db48a252f3af03923defe82'
        });
    });

    /*
    * Test get skill details
    * GET /tutors/:tutorId/skills/:skillId
    * Retrieve tutor skill
    */
    const getPattern = '/tutors/:tutorId/skills/:skillId';
    describe(`GET ${getPattern}`, () => {
        validateIds('GET', getPattern, {
            tutorId: '5db48a252f3af03923defe82',
            skillId: {
                id: '5db88a888f8af88888defe88',
                canBeMissing: true
            }
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
            tutorId: '5db48a252f3af03923defe82'
        }, validSkill);
    });
});
