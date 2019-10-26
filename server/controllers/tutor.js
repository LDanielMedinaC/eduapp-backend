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
        let payloadStudy = req.body;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate study exists
        let studies = tutor.tutorDetails.studies;
        let matchingStudies = studies.filter(study => study._id == studyId);
        if(!matchingStudies.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'study');
            return res.status(error.status).send({ error: error });
        }

        // Get the study
        studies = studies.filter((study) => {
            return study._id != studyId;
        });
        let study = matchingStudies[0];

        // Update study fields
        for(let prop in study) {
            if(Object.prototype.hasOwnProperty.call(study, prop))
                study[prop] = payloadStudy[prop] ? payloadStudy[prop] : study[prop];
        }
        
        // Validate dates
        if(study.endDate <= study.startDate) {
            let error = ErrorFactory.buildError(Errors.DATE_ORDER, 'endDate', 'startDate');
            return res.status(error.status).send({ error: error });
        }

        if(study.validationDate < study.endDate) {
            let error = ErrorFactory.buildError(Errors.DATE_ORDER, 'validationDate', 'endDate');
            return res.status(error.status).send({ error: error });
        }
        
        studies.push(study);
        tutor.tutorDetails.studies = studies;
        try {
            tutor.markModified('tutorDetails.studies');
            await tutor.save();
            return res.status(200).send(study);
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
    },

    /*
    ##########################
    ##### CERTIFICATIONS #####
    ##########################
    
    */

    async getCert(req, res) {
        let tutorId = req.params.tutorId;
        let certID = req.params.certificationId;

         // Validate tutor exists
         let tutor = await User.findById(tutorId).exec();
         if(!tutor || !tutor.tutorDetails ) {
             let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
             return res.status(error.status).send({ error: error });
         }
 
         // Validate cert exists
         let certifications = tutor.tutorDetails.certifications;
 
         let martchingCert;
         for(let cert of certifications) {
             if(cert._id == certID)
                martchingCert = cert;
         }
 
         if(!martchingCert) {
             let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'certification');
             return res.status(error.status).send({ error: error });
         }
         
         res.status(200).send(martchingCert);
    },


    async getAllCerts(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        res.status(200).send(tutor.tutorDetails.certifications);
    },

    async insertCert(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate payload
        let certification = req.body;

        // Insert into array
        if(!tutor.tutorDetails.certifications)
            tutor.tutorDetails.certifications = [];
        tutor.tutorDetails.certifications.push(certification);

        tutor.save()
        .then( (tutor) => {
            const insertedCertIndex = tutor.tutorDetails.certifications.length - 1;
            res.status(201).send(tutor.tutorDetails.certifications[insertedCertIndex]);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
            return res.status(error.status).send({ error: error });
        });
    },

    async updateCert(req, res) {
        let tutorId = req.params.tutorId;
        let certId = req.params.certId;
        let updatedCert = req.body;

         // Validate tutor exists
        const tutor = await User.findById(tutorId)
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        User.findOneAndUpdate({
            "_id": tutorId, "tutorDetails.certifications._id": certId
        }, {
            "$set" : {
                "tutorDetails.certifications.$": updatedCert
            }
        }, function (err, user){

            if (!err)
            {
                let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'certification');
                return res.status(error.status).send({ error: error });
            }
            else
            {
                let certs = user.tutorDetails.certifications.filter(c => c._id == certId);
                
                res.status(200).send(certs[0]);
            }
        })
    },

    async deleteCert(req, res) {
        let tutorId = req.params.tutorId;
        let certId = req.params.certificationId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate cert exists
        let certifications = tutor.tutorDetails.certifications;
        if(!certifications.filter(cert => cert._id == certId).length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'certification');
            return res.status(error.status).send({ error: error });
        }

        tutor.tutorDetails.certifications.pull({_id: certId});
        tutor.save()
        .then( (tutor) => {
            res.status(200).send();
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
            return res.status(error.status).send({ error: error });
        });
    },

};
