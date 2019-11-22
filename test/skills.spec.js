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
const validateIds = (method, routePattern, validIds) => {
    const idParamRegex = /(:\w+Id)/;
    const idRegexGlobal = /(?:\:)(\w+Id)/g;
    const modelRegex = /(\w+)(?:Id)/;

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
        // Test with id removed
        let model = modelRegex.exec(id)[1];
        let route = routePattern.replace(`:${id}`, '');

        // Test with id removed only if 'canBeMissing' is not enabled
        if(validIds[id] && !validIds[id].canBeMissing) {
            for(let key in validIds)
                route = route.replace(`:${key}`, validIds[key].id || validIds[key]);

            it(`No ${model} id [${route}]`, (done) => {
                if(idParamRegex.test(route))
                    throw new Error(`Provided ids do not match route pattern: ${route}`);

                let chaiMethod = method.toLowerCase();
                chai.request(server)
                [chaiMethod](route) // If this line fails you are using a not allowed HTTP method
                .end((err, res) => {
                    shouldBeError(res, done, Errors.ROUTE_ERROR);
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
});
