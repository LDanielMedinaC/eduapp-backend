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
    'POST', 'PUT', 'DELETE'
*/
const validateIds = (method, routePattern, validIds) => {
    // Extract ids to validate in route pattern
    const idRegex = /(:\w+Id)/;
    const idRegexGlobal = /(:\w+Id)/g;
    const modelRegex = /(?:\:)(\w+)(?:Id)/;
    let ids = routePattern.match(idRegexGlobal);

    // For each id to validate: remove, replace for non-ObjectID, use
    // non-findable id
    for(let id of ids) {
        // Test with id removed
        let model = modelRegex.exec(id)[1];
        let route = routePattern.replace(id, '');
        for(let key in validIds)
            route.replace(key, validIds[key]);

        it(`No ${model} id [${route}]`, (done) => {
            if(idRegex.test(route))
                throw new Error(`Provided ids do not match route pattern: ${route}`);

            switch(method) {
                case 'GET':
                    chai.request(server)
                    .get(route)
                    .end((err, res) => {
                        shouldBeError(res, done, Errors.ROUTE_ERROR);
                    });
                    break;
            }
        });
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

    const getPattern = '/tutors/:tutorId/skills/:skillId';
    describe(`GET ${getPattern}`, () => {
        validateIds('GET', getPattern, {
            tutorId: '5db48a252f3af03923defe82',
            skillId: '5db88a888f8af88888defe88'
        });
    });
});
