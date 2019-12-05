const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const _ = require("lodash");

const server = 'localhost:8000';
const db = require('../server/models');
const User = require('../server/models').User;
const tutors = require('../mock/tutors');

const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);
let invoiceTypes = require('../server/resources').invoiceTypes;
let validInvoice = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535',
    intNum: 2
}

let missingRFC = {
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingInvoiceType = {
    rfc: 'SUSH991111AAA',
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingStreet = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingExtNum = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

//This one shouldn't fail
let missingIntNum = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingColony = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingCountry = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingState = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingCity = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let missingMunicipality = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    pc: '72535'
}

let missingPC = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla'
}

let invalidRFC1 = {
    rfc: 'SUSH991111AAAA',//too long
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidRFC2 = {
    rfc: 'SUSH99111',//too short
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

/*let invalidRFC3 = {
    rfc: 'AAA9999A99AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}*/

let invalidInvoiceType = {
    rfc: 'SUSH991111AAA',
    invoiceType: 'not valid',
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidStreet = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidExtNum1 = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 'ahhh',
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidExtNum2 = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 9999999999,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidIntNum1 = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 'ahh',
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidIntNum2 = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 9999999999,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidColony = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidCountry = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    country: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    colony: 'Colonia 1',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidState = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    state: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    country: 'Mexico',
    colony: 'Colonia 1',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

let invalidCity = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    city: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    country: 'Mexico',
    colony: 'Colonia 1',
    state: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}
  
let invalidMunicipality = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    municipality: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    country: 'Mexico',
    colony: 'Colonia 1',
    state: 'Puebla',
    city: 'Puebla',
    pc: '72535'
} 

let invalidPC = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    street: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '725351234567890'
}


describe('POST /invoices', () => {

    let user;
    before(done => {
        db.connectDB()
        .then(async () => {

            user = await User.findById('5db48a252f3af03923defe7c').exec();
            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Valid invoice info', (done) => {
        console.log(user._id)
        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(validInvoice)
        .end((err, res) => {

            res.should.have.status(201);
            res.body.should.be.an('object');

            done();
        });

    });

    it('Missing RFC', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingRFC)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Missing Invoice Type', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingInvoiceType)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Missing Street', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingStreet)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });
    
    it('Missing Exterior Number', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingExtNum)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });
    it('Missing Interior Number', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingIntNum)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');
            done();
        });

    });

    it('Missing Colony', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingColony)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });    
    it('Missing Country', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingCountry)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });
    it('Missing State', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingState)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Missing City', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingCity)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });
    it('Missing Municipality', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingMunicipality)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Missing Postal Code', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(missingPC)
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });
    it('Invalid RFC Too long', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidRFC1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Invalid RFC Too short', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidRFC2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);
        });

    });
    it('Invalid Invoice Type', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidInvoiceType)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });
    it('Street Too Long', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidStreet)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Invalid Outdoor Number, not number', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidExtNum1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
        });

    });

    it('Invalid Outdoor Number, too big', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidExtNum2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
        });

    });
    it('Invalid Indoor Number, not number', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidIntNum1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
        });

    });
    it('Invalid Indoor Number, too big', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidIntNum2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
        });

    });

    it('Too Long Colony', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidColony)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long Country', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidCountry)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long State', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidState)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long City', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidCity)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long Municipality', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidMunicipality)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long PC', (done) => {

        chai.request(server)
        .post(`/users/${user._id}/invoices`)
        .send(invalidPC)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
});

describe('GET /users/:userId/invoices', () => {
    let userWithInvoice;
    let userWithoutInvoice; 
    before(done => {
        db.connectDB()
        .then(async () => {

            userWithInvoice = await User.findById('5db48a252f3af03923defe7c').exec();
            userWithoutInvoice = await User.findById('5db48a252f3af03983aaae7c').exec();
            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Correct get of all invoices', (done) => {

        chai.request(server)
        .get(`/users/${userWithInvoice._id}/invoices`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            
            done();
        });

    });

    it('Correct get of no invoices', (done) => {

        chai.request(server)
        .get(`/users/${userWithoutInvoice._id}/invoices`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            
            done();
        });

    });

});

describe('GET /users/:userId/invoices/:invoiceId', () => {
    let userWithInvoice;
    let userWithoutInvoice; 
    let invoiceId;
    before(done => {
        db.connectDB()
        .then(async () => {

            userWithInvoice = await User.findById('5db48a252f3af03923defe7c').exec();
            userWithoutInvoice = await User.findById('5db48a252f3af03983aaae7c').exec();
            
            invoiceId = userWithInvoice.invoiceInformation[0]._id;
            
            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Get correct ids', (done) => {

        chai.request(server)
        .get(`/users/${userWithInvoice._id}/invoices/${invoiceId}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            done();
        });
        
    });

    it('incorrect user id', (done) => {

        chai.request(server)
        .get(`/users/ffffffffffffff0123456789/invoices/${invoiceId}`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });
        
    });
    it('incorrect id', (done) => {

        chai.request(server)
        .get(`/users/${userWithInvoice._id}/invoices/ffffffffffffff0123456789`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });
        
    });

});

describe('PUT /invoices', () => {

    let user;
    let invoiceId;
    before(done => {
        db.connectDB()
        .then(async () => {

            user = await User.findById('5db48a252f3af03923defe7c').exec();
            invoiceId = user.invoiceInformation[0]._id;
            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Valid invoice info', (done) => {
        console.log(user._id)
        chai.request(server)
        .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(validInvoice)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('object');

            done();
        });

    });

    
    it('Invalid RFC Too long', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidRFC1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Invalid RFC Too short', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidRFC2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.SHORT_STRING);
        });

    });
    it('Invalid Invoice Type', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidInvoiceType)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });
    it('Street Too Long', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidStreet)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Invalid Outdoor Number, not number', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidExtNum1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
        });

    });

    it('Invalid Outdoor Number, too big', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidExtNum2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
        });

    });
    it('Invalid Indoor Number, not number', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidIntNum1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_DATA_TYPE);
        });

    });
    it('Invalid Indoor Number, too big', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidIntNum2)
        .end((err, res) => {
            shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
        });

    });

    it('Too Long Colony', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidColony)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long Country', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidCountry)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long State', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidState)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long City', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidCity)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long Municipality', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidMunicipality)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
    it('Too Long PC', (done) => {

        chai.request(server)
       .put(`/users/${user._id}/invoices/${invoiceId}`)
        .send(invalidPC)
        .end((err, res) => {
            shouldBeError(res, done, Errors.LONG_STRING);
        });

    });
});

describe('Delete /users/:userId/invoices/:invoiceId', () => {
    let userWithInvoice;
    let userWithoutInvoice; 
    let invoiceId;
    before(done => {
        db.connectDB()
        .then(async () => {

            userWithInvoice = await User.findById('5db48a252f3af03923defe7c').exec();
            userWithoutInvoice = await User.findById('5db48a252f3af03983aaae7c').exec();
            
            invoiceId = userWithInvoice.invoiceInformation[0]._id;
            
            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });


    it('incorrect user id', (done) => {

        chai.request(server)
        .delete(`/users/ffffffffffffff0123456789/invoices/${invoiceId}`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });
        
    });

    it('incorrect invoice id', (done) => {

        chai.request(server)
        .delete(`/users/${userWithInvoice._id}/invoices/ffffffffffffff0123456789`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });
        
    });

    it('Correct id', (done) => {

        chai.request(server)
        .delete(`/users/${userWithInvoice._id}/invoices/${invoiceId}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            done();
        });
        
    });

});

