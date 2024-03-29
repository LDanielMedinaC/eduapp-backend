'use strict'

const mongoose = require('mongoose');
const User = require('../models').User;
const Topic = require('../models').Topic;
const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors;

module.exports = {

    async list(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let skills = tutor.tutorDetails.skills;

        let cSkill = [];

        for(let skill of skills) {
            let topic = await Topic.findById(skill.topic).exec();

            if(!topic) {
                let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
                return res.status(error.status).send({ error: error });
            }

            cSkill.push({
                name: topic.name,
                field: topic.field,
                experience: skill.experience,
                _id: skill._id
            })
        }

        return res.status(200).send(cSkill);
    },

    async create(req, res){
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        // Validate skill exists
        let nSkill = req.body;

        let session = await mongoose.startSession();
        await session.startTransaction();

        let relatedTopic = await Topic.findOne({'name': nSkill.name, 'field': nSkill.field}).exec();
        let skillId = new mongoose.mongo.ObjectId();

        if(relatedTopic) {
            // Validate tutor does not already have the skill
            for(let skill of tutor.tutorDetails.skills) {
                if(`${skill.topic}` === `${relatedTopic._id}`) {
                    let error = ErrorFactory.buildError(Errors.CLIENT_ERROR, 'Skill already defined for this tutor.');
                    return res.status(error.status).send({error: error});
                }
            }

            tutor.tutorDetails.skills.push({
                topic: relatedTopic._id,
                experience: nSkill.experience,
                _id: skillId
            });

            if(!relatedTopic.tutors)
                relatedTopic.tutors = [];

            relatedTopic.tutors.push(tutorId);
            tutor.markModified('tutorDetails.skills');

            tutor.save()
            .then((t) => {
                relatedTopic.save()
                .then(async (u) => {
                    await session.commitTransaction();
                    return res.status(200).send({
                        _id: skillId,
                        experience: nSkill.experience,
                        name: nSkill.name,
                        field: nSkill.field
                    });
                })
                .catch(async (err) => {
                    await session.abortTransaction();
                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                })
            })
            .catch(async (err) => {
                await session.abortTransaction();
                return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
            });
        }
        else{
            let newTopic = new Topic({
                name: nSkill.name,
                field: nSkill.field,
                tutors: [tutorId]
            });

            let topicId = null;

            newTopic.save()
            .then((nTopic) => {
                topicId = nTopic._id;

                tutor.markModified('tutorDetails.skills');

                tutor.tutorDetails.skills.push({
                    topic: topicId,
                    experience: nSkill.experience,
                    _id: skillId
                });

                tutor.save()
                .then(async (updatedTuror) => {
                    await session.commitTransaction();
                    return res.status(200).send({
                        _id: skillId,
                        experience: nSkill.experience,
                        name: nSkill.name,
                        field: nSkill.field
                    });
                })
                .catch(async (err) => {
                    await session.abortTransaction();
                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                })
            })
            .catch(async (err) => {
                await session.abortTransaction();
                return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
            });
        }
    },

    async get(req, res){
        let tutorId = req.params.tutorId;
        let skillId = req.params.skillId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let skills = tutor.tutorDetails.skills;

        for(let skill of skills){
            if(skill._id == skillId){
                let topic = await Topic.findById(skill.topic);

                if(!topic){
                    let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
                    return res.status(error.status).send({ error: error });
                }

                let rSkill = {
                    name: topic.name,
                    field: topic.field,
                    experience: skill.experience,
                    _id: skill._id
                }
                return res.status(200).send(rSkill);
            }
        }

        let err = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'skill');
        return res.status(err.status).send({error: err});
    },

    async update(req, res){
        let tutorId = req.params.tutorId;
        let skillId = req.params.skillId;

        let nSkill = req.body;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let skills = tutor.tutorDetails.skills;
        let fSkill = skills.filter(skill => skill._id == skillId);

        if(!fSkill.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'skill');
            return res.status(error.status).send({ error: error });
        }

        let skill = fSkill[0];

        let session = await mongoose.startSession();
        await session.startTransaction();
        
        // Topic related to current skill
        let topic = await Topic.findById(skill.topic);
        if(!topic) {
            await session.abortTransaction();
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
            return res.status(error.status).send({ error: error });
        }
        else {
            // We're updating experience only
            if( ((nSkill.name && nSkill.name == topic.name) || !nSkill.name) && ((nSkill.field && nSkill.field == topic.field) || !nSkill.field)) {
                skill.experience = nSkill.experience || skill.experience;
                tutor.markModified('tutorDetails.skills');
                tutor.save()
                .then(async (updatedTutor) => {
                    await session.commitTransaction();
                    return res.status(200).send({
                        name: topic.name,
                        field: topic.field,
                        experience: skill.experience,
                        _id: skillId
                    })
                })
                .catch(async (err) => {
                    await session.abortTransaction();
                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                })
            }
            else {
                // We're changing the related topic, update count
                if(topic.tutors.length == 1) {
                    topic.name = nSkill.name || topic.name;
                    topic.field = nSkill.field || topic.field;
                    skill.experience = nSkill.experience || skill.experience;

                    nSkill.name = topic.name
                    nSkill.field = topic.field;
                    nSkill.experience = skill.experience;
                    nSkill._id = skill._id;

                    topic.save()
                    .then()
                    .catch(async (err) => {
                        await session.abortTransaction();
                        return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                    })
                    tutor.markModified('tutorDetails.skills');
                    tutor.save()
                    .then(async (updatedTutor) => {
                        await session.commitTransaction();
                        return res.status(200).send(nSkill);
                    })
                    .catch(async (err) => {
                        await session.abortTransaction();
                        return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                    })
                } else {
                    let delTutor = topic.tutors.filter(tutor => tutor != tutorId);
                    topic.tutors = delTutor;
                    
                    topic.save()
                    .then(async (updatedTopic) => {
                        skill.experience = nSkill.experience || skill.experience;
                        let relatedTopic = await Topic.findOne({'name': nSkill.name, 'field': nSkill.field}).exec();

                        if(relatedTopic){
                            skill.topic = relatedTopic._id;
                            tutor.markModified('tutorDetails.skills');
                            tutor.save()
                            .then(() => {
                                relatedTopic.save()
                                .then(async (updatedTopic) => {
                                    await session.commitTransaction();
                                    return res.status(200).send({
                                        name: updatedTopic.name,
                                        field: updatedTopic.field,
                                        experience: skill.experience,
                                        _id: skill._id
                                    })
                                })
                                .catch(async (err) => {
                                    await session.abortTransaction();
                                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                                })
                            })
                            .catch(async (err) => {
                                await session.abortTransaction();
                                return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                            })
                        }
                        else{
                            let newTopic = new Topic({
                                name: nSkill.name || topic.name,
                                field: nSkill.field || topic.skill
                            })
                            newTopic.save()
                            .then((nTopic) => {
                                skill.topic = nTopic._id;
                                tutor.save()
                                .then(async (updatedTutor) => {
                                    await session.commitTransaction();
                                    return res.status(200).send({
                                        name: nTopic.name,
                                        field: nTopic.field,
                                        experience: skill.experience,
                                        _id: skill._id
                                    })
                                })
                                .catch(async (err) => {
                                    await session.abortTransaction();
                                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                                })
                            })
                            .catch(async (err) => {
                                await session.abortTransaction();
                                return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                            })
                        }
                    })
                    .catch(async (err) => {
                        await session.abortTransaction();
                        return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                    })
                }
            }
        }
    },

    async delete(req, res){
        let tutorId = req.params.tutorId;
        let skillId = req.params.skillId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let skills = tutor.tutorDetails.skills;

        let fSkill = skills.filter(skill => skill._id == skillId);

        if(!fSkill.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'skill');
            return res.status(error.status).send({ error: error });
        }

        let skill = fSkill[0];

        let session = await mongoose.startSession();

        await session.startTransaction();

        let topic = await Topic.findById(skill.topic);

        if(!topic){
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
            await session.abortTransaction();
            return res.status(error.status).send({ error: error });
        }
        else{

            let delSkill = skills.filter((skill) =>{
                return skill._id != skillId;
            });

            if(topic.tutors.length == 1){
                let flag = false;
                try{
                    await Topic.findByIdAndDelete(topic._id).exec();
                    flag = true;
                }
                catch (err){
                    let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
                    await session.abortTransaction();
                    return res.status(error.status).send({ error: error });
                }
                if(flag){
                    tutor.tutorDetails.skills = delSkill;
                    tutor.markModified('tutorDetails.skills');
                    tutor.save()
                    .then(async (updatedTutor) => {
                        await session.commitTransaction()
                        return res.status(200).send(updatedTutor);
                    })
                    .catch(async (err) => {
                        await session.abortTransaction();
                        return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                    });
                }  
            }
            else{
                let delTutors = topic.tutors.filter((tutor) =>{
                    return tutor != tutorId;
                });
                topic.tutors = delTutors;
                tutor.tutorDetails.skills = delSkill;
                tutor.markModified('tutorDetails.skills');
                topic.save()
                .then(async (updatedTopic) => {
                    tutor.save()
                    .then(async (updatedTutor) => {
                        await session.commitTransaction();
                        return res.status(200).send(updatedTutor)
                    })
                    .catch(async (err) => {
                        await session.abortTransaction();
                        return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                    });  
                })
                .catch(async (err) => {
                    await session.abortTransaction();
                    return res.status(500).send({error: ErrorFactory.buildError(Errors.DATABASE_ERROR, err)});
                });  

            }
        }
    }
}