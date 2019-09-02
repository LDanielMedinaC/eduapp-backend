const mongoose = require('mongoose');
const userController = require('../server/controllers').landingPage;
const userModel = require('../server/models').landingPage;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app')
const should = chai.should();

chai.use(chaiHttp);

/*
* Test PUT to /landingpage
*/
describe('PUT /landingpage', () => {
    it('Should update', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Titulo',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Sections');
            res.body.should.have.property('LogoImgURL');
        });
    });

    it('Title too short', () => {
        let update_lp = {
            Sections: [
                {
                    Title: '',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Title too LONG', () => {
        let update_lp = {
            Sections: [
                {
                    Title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Description too long', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Invalid image url', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: 'Description',
                    BackgroundImgURL: 'Lol',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('No sections', () => {
        let update_lp = {
            Sections: [],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Invalid URL', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'lol',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Title too long', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Description too long', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
                        }
                    ]
                }
            ],
            LogoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

    it('Invalid URL', () => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    Description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            Description: 'Description'
                        }
                    ]
                }
            ],
            LogoImgURL: 'lol'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2)
        });
    });

});