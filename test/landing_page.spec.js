const mongoose = require('mongoose');
const userController = require('../server/controllers').landingPage;
const userModel = require('../server/models').landingPage;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'localhost:8000';
const should = chai.should();

chai.use(chaiHttp);

/*
* Test PUT to /landingpage
*/
describe('PUT /landingpage', () => {
    it('Should update', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Titulo',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            done();
        });
    });

    it('Title too short', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: '',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            done();
        });
    });

    it('Title too LONG', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Description too long', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Invalid image url', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: 'Description',
                    BackgroundImgURL: 'Lol',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('No sections', (done) => {
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Invalid URL', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'lol',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Title too long', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Description too long', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: 'This description is too long for the mongoose validation to pass, so it should be rejected and produce a bad response when sent as a payload in the post request for landingpages. If this landing page section description is validated and saved then something is wrong.',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Whatever'
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
            res.body.error.code.should.be.eql(2);
            done(); 
        });
    });

    it('Invalid URL', (done) => {
        let update_lp = {
            Sections: [
                {
                    Title: 'Title',
                    description: 'Description',
                    BackgroundImgURL: 'ftp::algo',
                    Elements: [
                        {
                            IconImgURL: 'ftp::algo',
                            ElementTitle: 'Title',
                            description: 'Description'
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
            res.body.error.code.should.be.eql(2);
            done();
        });
    });

    it('Valid Carrousel URL', (done) => {
        let update_lp = {
            Carrousel: ['https::myimageurl']
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });
    });

    it('Invalid Carrousel URL', (done) => {
        let update_lp = {
            Carrousel: 'Htt:invalid'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('code');
            res.body.error.code.should.be.eql(2);

            done();
        });
    });

    it('No Carrousel updated, remains the same after', (done) => {
        let update_lp = {
            Carrousel: 'http::url'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            
            let newLP = {
                Carrousel: []
            };

            chai.request(server)
            .put('/landingpages')
            .send(update_lp)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Carrousel');
                res.body.Carrousel.should.be.eql(['http::url']);

                done();
            });

                
        });
    });

});