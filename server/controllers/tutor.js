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

        console.log("saludos"); 

        let user = await User.findById(req.params.id).exec();

        console.log("salu2"); 

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

    async get(req, res) {
        let topic = req.query.topic;

        if(topic) {
            // Look for topic id
            let topicId = await Topic.findOne({'name': topic}).exec();
            topicId = topicId._id;

            if(!topicId)
                return res.status(200).send({});

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
