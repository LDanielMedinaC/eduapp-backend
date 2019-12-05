'use strict'

const chai = require('chai');
const should = chai.should();
const Errors = require('../server/resources').Errors;

const randomCharCode = () => {
    return Math.round((Math.random() * (122 - 97) + 97));
};

const shouldBeError = (res, done, code) => {
    try {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(code);

        done();
    } catch(err) {
        err.message += '\n';
        err.message += JSON.stringify(res.body, null, 4);
        throw err;
    }
};

const shouldBeNotFound = (res, done) => {
    try {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(Errors.OBJECT_NOT_FOUND);

        done();
    } catch(err) {
        err.message += '\n';
        err.message += JSON.stringify(res.body, null, 4);
        throw err;
    }
};

const randomString = (length) => {
    let string = '';
    for(let i = 0; i < length; i++)
        string += String.fromCharCode(randomCharCode());
    
    return string;
};

module.exports = {
    shouldBeError,
    shouldBeNotFound,
    randomString
};
