const mongoose = require('mongoose');
const userController = require('../server/controllers').user;
const userModel = require('../server/models').user;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();


const Errors = require('../server/resources').Errors;
const shouldBeError = require('./helpers').shouldBeError;
const shouldBeNotFound = require('./helpers').shouldBeNotFound;

chai.use(chaiHttp);

/*
* Test POST to /user
*/
describe('POST /user', () => {
  it('Should create a new user', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'johnny@banana.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('email');
        res.body.should.have.property('name');
        res.body.should.have.property('phone');
        res.body.should.have.property('country');
        res.body.should.have.property('language');
         
        done();
      });
  });

  it('User name too short', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'U',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(1)
         
        done();
      });
  });

  it('User name too long', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'abcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifangjolnb',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(1)
         
        done();
      });
  });

  it('No user name', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(2)
         
        done();
      });
  });

  it('Non alphabetic chars in name', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'U1',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(3);
         
        done();
      });
  });

  it('Phone too short', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(4);

        done();
         
      });
  });

  it('Phone too long', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'User user',
      phone: '22222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(4);

        done();
         
      });
  });

  it('No phone', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'User user',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(5);
         
        done();
      });
  });

  it('Invalid phone', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'user@mail.com',
      name: 'User user',
      phone: '222222a22',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(4)
         
        done();
      });
  });

  it('Too short email', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'a@',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(7)
        
        done();
      });
  });

  it('Too long email', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij@mail.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(7)
         
        done();
      });
  });

  it('No email', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(8);
         
        done();
      });
  });

  it('@ at 0', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: '@useremail.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(9)
         
        done();
      });
  });

  it('@ at end', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'useremail.com@',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(9)
         
        done();
      });
  });

  it('No @', (done) => {
    let new_user = {
      uid: 'aaabbbccc',
      email: 'useremail.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(9)
         
        done();
      });
  });

  it('No Firebase UID', (done) => {
    let new_user = {
      email: 'johnny@banana.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };

    chai.request(server)
      .post('/users')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(11)
         
        done();
      });
  });

});

/*
* Test GET to /user/:id
*/

describe('GET /users/:id', () => {

    it('Given ID is not a user', (done) => {
       
      let id = 'guerrerosupremo';

        chai.request(server)
        .get('/users/'+id)
        .end((err, res) => {
            shouldBeNotFound(res, done);
        });
    });

    it('Succesful get of an user', (done) => {
    
      
      let id = 'usuario3';
            
        chai.request(server)
        .get('/users/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
        
     });
});

/*
* Test PUT to /user
*/
describe('PUT /users', () => {
  it('Should update', (done) => {

    let id = 'usuario3';

    let update_user = {
        email: 'juancho_great@live.com.mx',
        name: 'Juan Ernesto',
        phone: '2223454590',
        language: 'Inglés',
        country: 'Chile'
    };

    chai.request(server)
    .put('/users/'+id)
    .send(update_user)
    .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('phone');
        res.body.should.have.property('country');
        res.body.should.have.property('language');
        res.body.should.have.property('email');
        res.body.should.have.property('name');
        done();
    });
  });

  it('Wrong id', (done) => {

    let id = 'usuario0';

    let update_user = {
        email: 'juancho_great@live.com.mx',
        name: 'Juan Ernesto',
        phone: '2223454590',
        language: 'Inglés',
        country: 'Chile'
    };

    chai.request(server)
    .put('/users/' + id)
    .send(update_user)
    .end((err, res) => {
      shouldBeNotFound(res, done);
    });

  });

  it('User name too short', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'U',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.SHORT_STRING);
      });
  });

  it('User name too long', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'abcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifangjolnb',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.LONG_STRING);
      });
  });

  it('Non alphabetic chars in name', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'Juan Ernesto 1',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.INVALID_FORMAT);
      });
  });

  it('Phone too short', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'Juan Ernesto',
      phone: '222345',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.NUMBER_LOWER_BOUND);
      });
  });

  it('Phone too long', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'Juan Ernesto',
      phone: '2223454590234',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.NUMBER_UPPER_BOUND);
      });
  });

  it('Invalid phone', (done) => {
    let id = 'usuario3';

    let update_user = {
      email: 'juancho_great@live.com.mx',
      name: 'Juan Ernesto',
      phone: '222345a459',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.INVALID_FORMAT);
      });
  });

  it('Too short email', (done) => {
    let id = 'usuario3';

    let update_user = {
      email: 'a@',
      name: 'Juan Ernesto',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.SHORT_STRING);
      });
  });

  it('Too long email', (done) => {

    let id = 'usuario3';

      let update_user = {
        email: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij@mail.com',
        name: 'Juan Ernesto',
        phone: '2223454590',
        language: 'Inglés',
        country: 'Chile'
      };
      chai.request(server)
        .put('/users/'+id)
        .send(update_user)
        .end((err, res) => {
          shouldBeError(res, done, Errors.LONG_STRING);
        });
  });

  it('@ at 0', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: '@live.com.mx',
      name: 'Juan Ernesto',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.INVALID_FORMAT);
      });
  });

  it('@ at end', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'useremail.com@',
      name: 'Juan Ernesto',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.INVALID_FORMAT);
    });

  });

  it('No @', (done) => {

    let id = 'usuario3';

    let update_user = {
      email: 'useremaillive.com.mx',
      name: 'Juan Ernesto',
      phone: '2223454590',
      language: 'Inglés',
      country: 'Chile'
    };
    chai.request(server)
      .put('/users/'+id)
      .send(update_user)
      .end((err, res) => {
        shouldBeError(res, done, Errors.INVALID_FORMAT);
      });
  });
});