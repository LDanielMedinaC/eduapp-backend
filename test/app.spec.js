const expect = require('chai').expect

describe('Moka-Chai smoke test', () => {
  it('Should return a string', () => {
    expect('CI with Travis').to.equal('CI with Travis');
  });
});