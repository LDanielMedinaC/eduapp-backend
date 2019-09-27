const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();
const User = require('../server/models').User;
const tutors = require('../mock/tutors');
const db = require('../server/models');

chai.use(chaiHttp);

/*
* Test list studies
* GET /tutors/:id/studies
* Should not be needed since GET /tutors/:id already includes studies
*/
describe('GET /tutors/:id/studies', () => {
    it('Should return studies', (done) => {
        db.connectDB()
        .then(async () => {
            console.log('DB connected');
            let tutor = await User.findOne({ 'email': tutors[0].email }).exec();

            db.disconnectDB()
            console.log('DB disconnected');

            let tutorId = tutor._id;

            console.log(`GET /tutors/${tutorId}/studies`);
            chai.request(server)
            .get(`/tutors/${tutorId}/studies`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
        })
        .catch(err => {
            done(new Error(err));
        });

    });

    // Invalid ID

    // Tutor not found
});

/*
* Test get study
* GET /tutors/:tutorId/studies/:id
* Should not be needed since GET /tutors/:tutorId already includes studies
*/

/*
* Test create study
* POST /tutors/:id/studies
*/

/*
* Test update study
* PATCH /tutors/:id/studies
* Should not be needed since GET /tutors/:id already includes studies
*/
