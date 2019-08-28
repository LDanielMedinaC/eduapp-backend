const mongoose = require('mongoose');
const userController = require('../server/controllers').user;
const userModel = require('../server/models').user;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app')
const should = chai.should();

chai.use(chaiHttp);

/*
* Test /Post
*/
describe('/POST user', () => {
  it('should create a new user', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('email');
        res.body.should.have.property('name');
        res.body.should.have.property('phone');
        res.body.should.have.property('country');
        res.body.should.have.property('language');
        document();
      });
  });

  it('User name too short', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'U',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(1)
        document();
      });
  });

  it('User name too long', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'abcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifabcdefghifangjolnb',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(1)
        document();
      });
  });

  it('No user name', () => {
    let new_user = {
      email: 'user@mail.com',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(2)
        document();
      });
  });

  it('Non alphabetic chars in name', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'U1',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(3)
        document();
      });
  });

  it('Phone too short', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(4)
        document();
      });
  });

  it('Phone too long', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'User user',
      phone: '22222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(5)
        document();
      });
  });

  it('No phone', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'User user',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(5)
        document();
      });
  });

  it('Invalid phone', () => {
    let new_user = {
      email: 'user@mail.com',
      name: 'User user',
      phone: '222222a22',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(6)
        document();
      });
  });

  it('Too short email', () => {
    let new_user = {
      email: 'a@',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(8)
        document();
      });
  });

  it('Too long email', () => {
    let new_user = {
      email: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij@mail.com',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(8)
        document();
      });
  });

  it('No email', () => {
    let new_user = {
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(9)
        document();
      });
  });

  it('@ at 0', () => {
    let new_user = {
      email: '@useremail.com',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(10)
        document();
      });
  });

  it('@ at end', () => {
    let new_user = {
      email: 'useremail.com@',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(10)
        document();
      });
  });

  it('No @', () => {
    let new_user = {
      email: 'useremail.com',
      name: 'User user',
      phone: '222222222',
      country: 'Mexico',
      language: 'es'
    };
    chai.request(server)
      .post('/user')
      .send(new_user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code');
        res.body.error.code.should.be.eql(10)
        document();
      });
  });

});