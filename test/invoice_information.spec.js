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

let validInvoice = {
    rfc: 'SUSH991111AAA',
    invoiceType: invoiceTypes[1],
    stret: 'Calle 1',
    extNum: 90,
    intNum: 2,
    colony: 'Colonia x',
    country: 'Mexico',
    state: 'Puebla',
    city: 'Puebla',
    municipality: 'Puebla',
    pc: '72535'
}

// let missingRFC = {
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingInvoiceType = {
//     rfc: 'SUSH991111AAA',
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingStreet = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingExtNum = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// //This one shouldn't fail
// let missingIntNum = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingColony = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingCountry = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingState = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingCity = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let missingMunicipality = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     pc: '72535'
// }

// let missingPC = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla'
// }

// let invalidRFC1 = {
//     rfc: 'SUSH991111AAAA',//too long
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidRFC2 = {
//     rfc: 'SUSH99111',//too short
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// /*let invalidRFC3 = {
//     rfc: 'AAA9999A99AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }*/

// let invalidInvoiceType = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: 'not valid',
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidStreet = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidExtNum1 = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 'ahhh',
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidExtNum2 = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 9999999999,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidIntNum1 = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 'ahh',
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidIntNum2 = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 9999999999,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidColony = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidCountry = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     country: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     colony: 'Colonia 1',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidState = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     state: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     country: 'Mexico',
//     colony: 'Colonia 1',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }

// let invalidCity = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     city: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     country: 'Mexico',
//     colony: 'Colonia 1',
//     state: 'Puebla',
//     municipality: 'Puebla',
//     pc: '72535'
// }
  
// let invalidMunicipality = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     municipality: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     country: 'Mexico',
//     colony: 'Colonia 1',
//     state: 'Puebla',
//     city: 'Puebla',
//     pc: '72535'
// } 

// let invalidPC = {
//     rfc: 'SUSH991111AAA',
//     invoiceType: invoiceTypes[1],
//     stret: 'Calle 1',
//     extNum: 90,
//     intNum: 2,
//     colony: 'Colonia x',
//     country: 'Mexico',
//     state: 'Puebla',
//     city: 'Puebla',
//     municipality: 'Puebla',
//     pc: '725351234567890'
// }


// describe('PaymentAccount POST', () => {

//     let user;
//     before(done => {
//         db.connectDB()
//         .then(async () => {

//             user = await User.findOne({ 'email': tutors[0].email }).exec();

//             db.disconnectDB()

//             done();
//         })
//         .catch(err => {
//             done(new Error(err));
//         });

//     });

//     it('Valid invoice info', (done) => {
//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(validInvoice)
//         .end((err, res) => {

//             res.should.have.status(201);
//             res.body.should.be.an('object');

//             done();
//         });

//     });

//     it('Missing RFC', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingRFC)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });

//     it('Missing RFC', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingRFC)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });

//     it('Missing Invoice Type', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingInvoiceType)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });

//     it('Missing Street', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingStreet)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });
//     it('Missing Exterior Number', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingExtNum)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });
//     it('Missing Interior Number', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingIntNum)
//         .end((err, res) => {
//             res.should.have.status(201);
//             res.body.should.be.an('object');
//             done();
//         });

//     });

//     it('Missing Colony', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingColony)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });    
//     it('Missing Country', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingCountry)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });
//     it('Missing State', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingState)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });

//     it('Missing City', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingCity)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });
//     it('Missing Municipality', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingMunicipality)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });

//     it('Missing Postal Code', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(missingPC)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.MISSING_FIELD);
//         });

//     });
//     it('Invalid RFC Too long', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(invalidRFC1)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.LONG_STRING);
//         });

//     });
//     it('Invalid RFC Too short', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(invalidRFC2)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.LONG_STRING);
//         });

//     });
//     it('Invalid Invoice Type', (done) => {

//         chai.request(server)
//         .post(`/users/${user._id}/invoices`)
//         .send(invalidInvoiceType)
//         .end((err, res) => {
//             shouldBeError(res, done, Errors.LONG_STRING);
//         });

//     });

// });

/*describe('PaymentAccount GET:id', () => {

    let tutor;
    let paymentAcc;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            paymentAcc = tutor.tutorDetails.paymentAccounts[0];

            paymentAcc._id = paymentAcc._id.toString('hex');

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .get(`/tutors/qwerty/paymentaccounts/${paymentAcc._id}`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .get(`/tutors/ffffffffffffff0123456789/paymentaccounts/${paymentAcc._id}`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Invalid paymentAccount ID', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentaccounts/qwerty`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('paymentAccount not found', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentaccounts/ffffffffffffff0123456789`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Valid and correct get', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentaccounts/${paymentAcc._id}`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('method');

            _.isEqual(res.body, paymentAcc).should.be.eql(true);
            
            done();
        });

    });

});

describe('PaymentAccount GET', () => {

    let tutor;
    let noPATutor;
    let paymentAccs;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            paymentAccs = tutor.tutorDetails.paymentAccounts;

            for (let pa of paymentAccs)
            {
                pa._id = pa._id.toString('hex');
            }

            noPATutor = await User.findOne({ 'email': tutors[1].email }).exec();

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .get(`/tutors/qwerty/paymentaccounts`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .get(`/tutors/ffffffffffffff0123456789/paymentaccounts`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });


    it('Correct get of all payment Accounts', (done) => {

        chai.request(server)
        .get(`/tutors/${tutor._id}/paymentaccounts`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.not.empty;
            
            _.isEqual(res.body, paymentAccs).should.be.eql(true);
            
            done();
        });

    });

    it('Correct get of no payment accounts', (done) => {

        chai.request(server)
        .get(`/tutors/${noPATutor._id}/paymentaccounts`)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('array').that.is.empty;
            
            _.isEqual(res.body, []).should.be.eql(true);
            
            done();
        });

    });

});

describe('PaymentAccount DELETE', () => {

    let tutor;
    let paymentAccs;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();
            paymentAccs = tutor.tutorDetails.paymentAccounts;

            for (let pa of paymentAccs)
            {
                pa._id = pa._id.toString('hex');
            }

            db.disconnectDB();

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .delete(`/tutors/qwerty/paymentaccounts/${paymentAccs[0]._id}`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {


        chai.request(server)
        .delete(`/tutors/ffffffffffffff0123456789/paymentaccounts/${paymentAccs[0]._id}`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Invalid paymentAccount ID', (done) => {

        chai.request(server)
        .delete(`/tutors/${tutor._id}/paymentaccounts/qwerty`)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('paymentAccount not found', (done) => {

        chai.request(server)
        .delete(`/tutors/${tutor._id}/paymentaccounts/ffffffffffffff0123456789`)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Valid delete of a paymentAccount', (done) => {

        let deleteIndex = paymentAccs.length - 1;

        chai.request(server)
        .delete(`/tutors/${tutor._id}/paymentaccounts/${paymentAccs[deleteIndex]._id}`)
        .end((err, res) => {

            res.should.have.status(200);

            chai.request(server)
            .get(`/tutors/${tutor._id}/paymentaccounts`)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.an('array').that.is.not.empty;

                paymentAccs.pop();
                
                _.isEqual(paymentAccs, res.body).should.be.eql(true);
                
                done();
            });
        });

    });

});

describe('PaymentAccount PUT', () => {

    let tutor;
    let paToUpdate;
    before(done => {
        db.connectDB()
        .then(async () => {

            tutor = await User.findOne({ 'email': tutors[0].email }).exec();

            paToUpdate = tutor.tutorDetails.paymentAccounts[0];

            paToUpdate._id = paToUpdate._id.toString('hex');

            db.disconnectDB()

            done();
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    it('Valid PUT', (done) => {

        let newPA = {
            method: 'paypal'
        }

        chai.request(server)
        .put(`/tutors/${tutor._id}/paymentaccounts/${paToUpdate._id}`)
        .send(newPA)
        .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.an('object');

            _.isEqual(res.body, paToUpdate).should.be.eql(false);

            chai.request(server)
            .get(`/tutors/${tutor._id}/paymentaccounts/${paToUpdate._id}`)
            .end((err2, res2) => {

                res2.should.have.status(200);
                res2.body.should.be.an('object');

                newPA._id = res2.body._id;

                _.isEqual(res2.body, newPA).should.be.eql(true);

                done();
            });
        });

    });

    it('Invalid PUT', (done) => {

        let newPA = {
            method: 'cash%6'
        }

        chai.request(server)
        .put(`/tutors/${tutor._id}/paymentaccounts/${paToUpdate._id}`)
        .send(newPA)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_FIELD);
        });

    });

    it('Invalid PUT - Empty object', (done) => {

        chai.request(server)
        .put(`/tutors/${tutor._id}/paymentaccounts/${paToUpdate._id}`)
        .send({})
        .end((err, res) => {
            shouldBeError(res, done, Errors.MISSING_FIELD);
        });

    });

    it('Invalid tutor ID', (done) => {

        chai.request(server)
        .put(`/tutors/qwerty/paymentaccounts/${paToUpdate._id}`)
        .send(validPayAccount1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });

    });

    it('Tutor not found', (done) => {

        chai.request(server)
        .put(`/tutors/ffffffffffffff0123456789/paymentaccounts/${paToUpdate._id}`)
        .send(validPayAccount1)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });

    });

    it('Invalid paymentAccount ID', (done) => {

        chai.request(server)
        .put(`/tutors/${tutor._id}/paymentaccounts/qwerty`)
        .send(validPayAccount1)
        .end((err, res) => {
            shouldBeError(res, done, Errors.INVALID_ID);
        });
    
    });
    
    it('PaymentAccount not found', (done) => {
    
        chai.request(server)
        .put(`/tutors/${tutor._id}/paymentaccounts/`)
        .send(validPayAccount1)
        .end((err, res) => {

            console.log(res.body);

            shouldBeNotFound(res, done);
        });
    });
    // it('Missing RFC', (done) => {
    //     chai.request(server)
    //     .put(`/tutors/${tutor._id}/paymentaccounts/ffffffffffffff0123456789`)
    //     .send(validPayAccount1)
    //     .end((err, res) => {
    //         console.log(res.body);
    //         shouldBeNotFound(res, done);
    //     });
    // });
});

*/
