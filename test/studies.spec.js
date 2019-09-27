const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();

chai.use(chaiHttp);

/*
* Test list studies
* GET /tutors/:id/studies
* Should not be needed since GET /tutors/:id already includes studies
*/
describe('GET /tutors/:id/studies', () => {
    it('Should return studies', () => {
        let tutorId = 0;

        chai.request(server)
        .get(`/tutors/${tutorId}/studies`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('array').that.is.not.empty;
            done();
        });
    });
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
