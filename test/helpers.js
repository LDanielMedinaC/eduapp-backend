'use strict'

const chai = require('chai');
const should = chai.should();
const Errors = require('../server/resources').Errors;

const shouldBeError = (res, done, code) => {
    res.should.have.status(400);
    res.body.should.be.an('object');
    res.body.should.have.property('error');
    res.body.error.should.have.property('code');
    res.body.error.code.should.be.eql(code);

    done();
};

const shouldBeNotFound = (res, done) => {
    res.should.have.status(404);
    res.body.should.be.an('object');
    res.body.should.have.property('error');
    res.body.error.should.have.property('code');
    res.body.error.code.should.be.eql(Errors.OBJECT_NOT_FOUND);

    done();
};

module.exports = {
    shouldBeError,
    shouldBeNotFound
};
