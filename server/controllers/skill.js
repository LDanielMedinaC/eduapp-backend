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
                name: topic.Name,
                field: topic.Field,
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

        session.startTransaction();

        let relatedTopic = await Topic.findOne({'Name': nSkill.name, 'Field': nSkill.Field}).exec;

        if(relatedTopic){
            
            tutor.skills.push({
                topic: relatedTopic._id,
                experience: nSkill.experience,
                _id: new mongoose.mongo.ObjectId()
            });

            relatedTopic.Tutors.push(tutorId);

            tutor.save()
            .catch((err) => {
                await session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            });

            relatedTopic.save()
            .catch((err) => {
                await session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })

        }
        else{
            let newTopic = new Topic({
                Name: nSkill.name,
                Field: nSkill.field,
                Tutors: [tutorId]
            });

            let topicId = null;

            newTopic.save()
            .then((nTopic) => {
                topicId = nTopic._id;
            })
            .catch((err) => {
                await session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            });

            tutor.skills.push({
                topic: topicId,
                experience: nSkill.experience,
                _id: new mongoose.mongo.ObjectId()
            });
            
            tutor.save()
            .then()
            .catch((err) => {
                await session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })

        }
        
        await session.commitTransaction();
        return res.status(200).send(nSkill);
    },

    async get(req, res){
        let tutorId = req.params.tutorId;
        let skillId = req.params.skillId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let skills = tutor.skills;

        for(let skill of skills){
            if(skill._id == skillId){
                let topic = await Topic.findById(skill.topic);

                if(!topic){
                    let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
                    return res.status(error.status).send({ error: error });
                }

                let rSkill = {
                    name: topic.Name,
                    field: topic.Field,
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

        let skills = tutor.skills;

        let fSkill = skills.filter(skill => skill._id == skillId);

        if(!fSkill.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'study');
            return res.status(error.status).send({ error: error });
        }

        let skill = fSkill[0];

        let session = await mongoose.startSession();

        session.startTransaction();
        
        let topic = await Topic.findById(skill.topic);

        if(!topic){
            session.abortTransaction();
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
            return res.status(error.status).send({ error: error });
        }

        if( ((nSkill.name && nSkill.name == topic.Name) || !nSkill.name) && ((nSkill.field && nSkill.field == topic.Field) || !nSkill.field)){
            skill.experience = nSkill.experience || skill.experience;
            tutor.save()
            .then((updatedTutor) => {
                session.commitTransaction();
                return res.status(200).send({
                    name: topic.Name,
                    field: topic.Field,
                    experience: skill.experience,
                    _id: skillId
                })
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })
        }

        if(topic.length.length == 1){
            topic.Name = nSkill.name || topic.Name;
            topic.Field = nSkill.field || topic.Field;
            skill.experience = nSkill.experience || skill.experience;

            nSkill.name = topic.Name
            nSkill.Field = topic.Field;
            nSkill.experience = skill.experience;
            nSkill._id = skill._id;

            topic.save()
            .then()
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })

            tutoy.save()
            .then((updatedTutor) => {
                session.commitTransaction();
                return res.status(200).send(nSkill);
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })
        }

        let delTutor = topic.tutors.filter(tutor => tutor != tutorId);
        topic.tutors = delTutor;

        relatedTopic.tutors.push(tutorId);
        topic.save()
        .then()
        .catch((err) => {
            session.abortTransaction();
            return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
        })
        
        skill.experience = nSkill.experience || skill.experience;

        let relatedTopic = await Topic.findOne({'Name': nSkill.name, 'Field': nSkill.Field}).exec;

        if(relatedTopic){
            skill.topic = relatedTopic._id;
            tutor.save()
            .then()
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })
            relatedTopic.save()
            .then((updatedTopic) => {
                session.commitTransaction();
                return res.status(200).send({
                    name: updatedTopic.Name,
                    field: updatedTopic.Field,
                    experience: skill.experience,
                    _id: skill._id
                })
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })
        }
        else{
            let newTopic = new Topic({
                Name: nSkill.name || topic.name,
                Field: nSkill.field || topic.skill
            })
            newTopic.save()
            .then((nTopic) => {
                skill.topic = nTopic._id;
                tutor.save()
                .then((updatedTutor) => {
                    session.commitTransaction();
                    return res.status(200).send({
                        name: nTopic.Name,
                        field: nTopic.Field,
                        experience: skill.experience,
                        _id: skill._id
                    })
                })
                .catch((err) => {
                    session.abortTransaction();
                    return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
                })
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            })
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

        let skills = tutor.skills;

        if(!skills.filter(skill => skill._id == skillId).length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'study');
            return res.status(error.status).send({ error: error });
        }

        let session = await mongoose.startSession();

        session.startTransaction();

        let topic = await Topic.findById(skill.topic);

        if(!topic){
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'related topic');
            session.abortTransaction();
            return res.status(error.status).send({ error: error });
        }

        let delSkill = skills.filter((skill) =>{
            return skill._id != skillId;
        });

        if(topic.tutors.length == 1){
            try{
                await Topic.findByIdAndDelete(topic._id).exec;
            }
            catch (err){
                let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err.errmsg || err);
                session.abortTransaction();
                return res.status(error.status).send({ error: error });
            }
            tutor.skills = delSkill;
            tutor.save()
            .then((updatedTutor) => {
                session.commitTransaction()
                return res.status(200).send(updatedTutor);
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            });  
        }
        else{
            let delTutors = topic.tutors.filter((tutor) =>{
                return tutor != tutorId;
            });
            topic.tutors = delTutors;
            tutor.skills = delSkill;
            topic.save()
            .then((updatedTopic) => {
                tutor.save()
                .then((updatedTutor) => {
                    session.commitTransaction();
                    return res.status(200).send(updatedTutor)
                })
                .catch((err) => {
                    session.abortTransaction();
                    return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
                });  
            })
            .catch((err) => {
                session.abortTransaction();
                return res.status(500).send(ErrorFactory.buildError(Errors.DATABASE_ERROR, err));
            });  

        }
    }
}