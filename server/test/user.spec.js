const expect = require('chai').expect
const user = require('../server/controllers').user;

describe('User tests', () => {
  it('should create a new user', () => {
    const new_user = {
      email: 'user@mail.com',
      name: 'User user',
      phone: '2222222222',
      country: 'Mexico',
      language: 'es'
    };
    const created_user = user.create(new_user);
    assert.deepEqual(created_user, new_user, 'User should be created')
  });
});