const mongoose = require('mongoose');
const userController = require('../server/controllers').user;
const userModel = require('../server/models').user;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app')
const should = chai.should();

chai.use(chaiHttp);

/*
* Test POST to /user
*/
describe('POST /user', () => {
  it('Should create a new user', () => {
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
         
      });
  });

  it('User name too short', () => {
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
         
      });
  });

  it('User name too long', () => {
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
         
      });
  });

  it('No user name', () => {
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
         
      });
  });

  it('Non alphabetic chars in name', () => {
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
        res.body.error.code.should.be.eql(3)
         
      });
  });

  it('Phone too short', () => {
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
        res.body.error.code.should.be.eql(4)
         
      });
  });

  it('Phone too long', () => {
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
        res.body.error.code.should.be.eql(4)
         
      });
  });

  it('No phone', () => {
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
        res.body.error.code.should.be.eql(5)
         
      });
  });

  it('Invalid phone', () => {
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
         
      });
  });

  it('Too short email', () => {
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
         
      });
  });

  it('Too long email', () => {
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
         
      });
  });

  it('No email', () => {
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
        res.body.error.code.should.be.eql(8)
         
      });
  });

  it('@ at 0', () => {
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
         
      });
  });

  it('@ at end', () => {
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
         
      });
  });

  it('No @', () => {
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
         
      });
  });

  it('No Firebase UID', () => {
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
         
      });
  });

});