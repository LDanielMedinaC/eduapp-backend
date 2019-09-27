const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models').User;
const Topic = require('../models').Topic;

module.exports = {

    async getDetails(req, res){

        if (!req.params.id) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No tutor id was provided.',
                    code: 1
                }
            });
        }

        let user = await User.findById(req.params.id).exec();

        if (!user)
        {
            return res.status(404).send({
                error: {
                    status: 404,
                    description: 'Tutor does not exist',
                    code: 2
                }
            });
        }

        if (!user.tutorDetails)
        {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Tutor provided is not a tutor',
                    code: 3
                }
            });
        }

        return res.status(200).send(user);
    },
    async getStudies(req, res) {
        let tutorId = req.params.id;

        // Validate id
        if(!tutorId || !ObjectId.isValid(tutorId)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: "given id is not a valid ID",
                    code: 20
                }
            });
        }

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            return res.status(404).send({
                error: {
                    status: 404,
                    description: "No tutor with given ID was found",
                    code: 1
                }
            });
        }

        res.status(200).send(tutor.tutorDetails.studies);
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
