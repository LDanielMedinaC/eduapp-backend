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
            sections: [
                {
                    title: 'Titulo',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('sections');
            res.body.should.have.property('logoImgURL');
            done();
        });
    });

    it('Title too short', (done) => {
        let update_lp = {
            sections: [
                {
                    title: '',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: 'Description',
                    backgroundImgURL: 'Lol',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'lol',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: 'This description is too long for the mongoose validation to pass, so it should be rejected and produce a bad response when sent as a payload in the post request for landingpages. If this landing page section description is validated and saved then something is wrong.',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Whatever'
                        }
                    ]
                }
            ],
            logoImgURL: 'http::algo'
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
            sections: [
                {
                    title: 'Title',
                    description: 'Description',
                    backgroundImgURL: 'ftp::algo',
                    elements: [
                        {
                            iconImgURL: 'ftp::algo',
                            elementTitle: 'Title',
                            description: 'Description'
                        }
                    ]
                }
            ],
            logoImgURL: 'lol'
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

    it('Valid carrousel URL', (done) => {
        let update_lp = {
            carrousel: ['https::myimageurl']
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

    it('Invalid carrousel URL', (done) => {
        let update_lp = {
            carrousel: 'Htt:invalid'
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

    it('No carrousel updated, remains the same after', (done) => {
        let update_lp = {
            carrousel: 'http::url'
        };
        chai.request(server)
        .put('/landingpages')
        .send(update_lp)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            
            let newLP = {
                carrousel: []
            };

            chai.request(server)
            .put('/landingpages')
            .send(update_lp)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('carrousel');
                res.body.carrousel.should.be.eql(['http::url']);

                done();
            });

                
        });
    });

});