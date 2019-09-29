const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models').User;
const Topic = require('../models').Topic;

function validateId(id) {
    if(!id || !ObjectId.isValid(id)) {
        return {
            status: 400,
            description: "given id is not a valid ID",
            code: 20
        };
    }
}

function validateStudy(study) {
    // Institution is required
    if(!study.institution) {
        return {
            error: {
                status: 400,
                description: 'Institution is required',
                code: 1
            }
        };
    }

    // Institution min length 2 characters
    if(study.institution.length < 2) {
        return {
            error: {
                status: 400,
                description: 'Institution should be at least 2 characters long',
                code: 2
            }
        };
    }

    // Degree is required
    if(!study.degree) {
        return {
            error: {
                status: 400,
                description: 'Degree is required',
                code: 3
            }
        };
    }

    // Degree min length 2 characters
    if(study.degree.length < 2) {
        return {
            error: {
                status: 400,
                description: 'Degree min length is 2 characters',
                code: 4
            }
        };
    }

    // Field is required
    if(!study.field) {
        return {
            error: {
                status: 400,
                description: 'Field is required',
                code: 5
            }
        };
    }

    // Field min length 2
    if(study.field.length < 2) {
        return {
            error: {
                status: 400,
                description: 'Field min length is 2',
                code: 6
            }
        };
    }

    // Grade is required
    if(!study.grade) {
        return {
            error: {
                status: 400,
                description: 'Grade is required',
                code: 7
            }
        };
    }

    // Grade is an integer
    if(!Number.isInteger(study.grade)) {
        return {
            error: {
                status: 400,
                description: 'Grade must be an integer',
                code: 8
            }
        };
    }

    // Grade length is 1 or 2
    if((study.grade + '').length < 1 || (study.grade + '').length > 2) {
        return {
            error: {
                status: 400,
                description: 'Grade should be 1 or 2 digits long',
                code: 9
            }
        };
    }
}

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
        let idError = validateId(tutorId);

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

        res.status(200).send(tutor.tutorDetails.studies);
    },
    async addStudy(req, res) {
        let tutorId = req.params.id;
        let idError = validateId(tutorId);

        if(idError)
            return res.status(idError.status).send(idError);

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

        // Validate payload
        let study = req.body;
        let firstStudyError = validateStudy(study);
        if(firstStudyError)
            return res.status(firstStudyError.error.status).send(firstStudyError);

        // Insert into array
        tutor.tutorDetails.studies.push(study);
        tutor.markModified('tutorDetails.studies');
        try {
            await tutor.save();
            res.status(201).send(tutor);
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
