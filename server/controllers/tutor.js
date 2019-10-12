'use strict'

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models').User;
const Topic = require('../models').Topic;
const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors;

module.exports = {
    async getDetails(req, res){
        let tutorId = req.params.tutorId;

        if (!tutorId || !ObjectId.isValid(tutorId)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No valid ObjectId was provided.',
                    code: 2
                }
            });
        }

        User.findById(tutorId)
        .then((user) => {
            if (!user)
            {
                return res.status(404).send({
                    error: {
                        status: 404,
                        description: 'Tutor does not exist',
                        code: 3
                    }
                });
            }

            return res.status(200).send(user);
        })
        .catch( (err) => 
        {
            res.status(500).send({
                error: {
                    status: 500,
                    description: `Database error: ${err}`,
                    code: 4
                }
            });
        });
    },
    async getStudy(req, res) {
        let tutorId = req.params.tutorId;
        let studyId = req.params.studyId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate study exists
        let studies = tutor.tutorDetails.studies;

        let matchingStudy;
        for(let study of studies) {
            if(study._id == studyId)
                matchingStudy = study;
        }

        if(!matchingStudy) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'study');
            return res.status(error.status).send({ error: error });
        }
        
        res.status(200).send(matchingStudy);
    },
    async getStudies(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        res.status(200).send(tutor.tutorDetails.studies);
    },
    async addStudy(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate payload
        let study = req.body;

        // Insert into array
        study._id = new mongoose.mongo.ObjectId();
        tutor.tutorDetails.studies.push(study);
        tutor.markModified('tutorDetails.studies');
        try {
            await tutor.save();
            return res.status(201).send(tutor);
        } catch(err) {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
            return res.status(error.status).send({ error: error });
        }
    },
    async deleteStudy(req, res) {
        let tutorId = req.params.tutorId;
        let studyId = req.params.studyId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate study exists
        let studies = tutor.tutorDetails.studies;
        if(!studies.filter(study => study._id == studyId).length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'study');
            return res.status(error.status).send({ error: error });
        }

        studies = studies.filter((study) => {
            return study._id != studyId;
        });

        tutor.tutorDetails.studies = studies;
        tutor.markModified('tutorDetails.studies');
        try {
            await tutor.save();
            res.status(200).send(tutor);
        } catch(err) {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
            res.status(error.status).send({ error: error });
        }
    },
    async updateStudy(req, res) {
        let tutorId = req.params.tutorId;
        let studyId = req.params.studyId;
        let tutorIdError = validateId(tutorId);
        let studyIdError = validateId(studyId);
        let payloadStudy = req.body;

        let idError = tutorIdError ? tutorIdError : studyIdError ? studyIdError : null;
        if(idError)
            return res.status(idError.status).send({ error: idError });

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            return res.status(404).send({
                error: {
                    status: 404,
                    description: "No tutor with given ID was found",
                    code: 21
                }
            });
        }

        // Validate study exists
        let studies = tutor.tutorDetails.studies;
        let matchingStudies = studies.filter(study => study._id == studyId);
        if(!matchingStudies.length)
            return res.status(404).send({
                error: {
                    status: 404,
                    description: 'Requested study was not found for given tutor',
                    code: 30
                }
            });

        // validate payload
        // Should have study
        if(Object.keys(payloadStudy).length === 0) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No study provided',
                    code: 25
                }
            });
        }

        if(payloadStudy.institution) {
            // Institution min length 2 characters
            if(payloadStudy.institution.length < 2) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'Institution should be at least 2 characters long',
                        code: 2
                    }
                });
            }
        }

        if(payloadStudy.degree) {
            // Degree min length 2 characters
            if(payloadStudy.degree.length < 2) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'Degree min length is 2 characters',
                        code: 4
                    }
                });
            }
        }

        if(payloadStudy.field) {
            // Field min length 2
            if(payloadStudy.field.length < 2) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'Field min length is 2',
                        code: 6
                    }
                });
            }
        }

        if(payloadStudy.grade) {
            // Grade is an integer
            if(!Number.isInteger(payloadStudy.grade)) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'Grade must be an integer',
                        code: 8
                    }
                });
            }

            // Grade length is 1 or 2
            if((payloadStudy.grade + '').length < 1 || (payloadStudy.grade + '').length > 2) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'Grade should be 1 or 2 digits long',
                        code: 9
                    }
                });
            }
        }

        if(payloadStudy.startDate) {
            // startDate should be valid date
            if(!Date.parse(payloadStudy.startDate)) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'startDate is not valid',
                        code: 11
                    }
                });
            }
        }

        if(payloadStudy.endDate) {
            // endDate should be valid date
            if(!Date.parse(payloadStudy.endDate)) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'endDate is not valid',
                        code: 13
                    }
                });
            }
        }

        if(payloadStudy.startDate && payloadStudy.endDate) {
            // endDate should be after startDate
            let startDate = Date.parse(payloadStudy.startDate);
            let endDate = Date.parse(payloadStudy.endDate);
            if(startDate >= endDate) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'endDate should be after startDate',
                        code: 14
                    }
                });
            }
        }

        if(payloadStudy.validationDate) {
            // validationDate should be valid date
            if(!Date.parse(payloadStudy.validationDate)) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: 'validationDate is not valid',
                        code: 16
                    }
                });
            }
        }

        studies = studies.filter((study) => {
            return study._id != studyId;
        });

        let study = matchingStudies[0];
        for(prop in study) {
            if(Object.prototype.hasOwnProperty.call(study, prop)) {
                study.prop = payloadStudy.prop ? payloadStudy.prop : study.prop;
            }
        }

        studies.push(study);

        tutor.tutorDetails.studies = studies;
        tutor.markModified('tutorDetails.studies');
        try {
            await tutor.save();
            res.status(200).send(study);
        } catch(err) {
            res.status(500).send({
                error: {
                    status: 500,
                    description: `Database error: ${err.errmsg || err}`,
                    code: 0
                }
            });
        }
    },
    async get(req, res) {
        let topic = req.query.topic;

        if(typeof(topic) != "undefined") {
            // Validate topic length
            if(topic.length == 0) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: "Topic should contain at least 1 character",
                        code: 2
                    }
                });
            }

            if(topic.length > 254) {
                return res.status(400).send({
                    error: {
                        status: 400,
                        description: "Topic is too long",
                        code: 1
                    }
                });
            }

            // Look for topic id
            let topicId = await Topic.findOne({'Name': topic}).exec();
            topicId = topicId ? topicId._id : null;

            if(!topicId)
                return res.status(200).json([]);

            let tutors = await User.where('tutorDetails').ne(null)
            .where('tutorDetails.taughtTopicsIDs').equals(topicId)
            .exec();
            
            return res.status(200).send(tutors);
        }

        // Return all tutors
        User.where('tutorDetails').ne(null).exec()
        .then(tutors => {
            return res.status(200).send(tutors);
        });
    }
};
