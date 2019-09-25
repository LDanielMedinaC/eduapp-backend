const User = require('../models').User;
const Topic = require('../models').Topic;

module.exports = {
    async get(req, res) {
        let topic = req.query.topic;

        if(topic) {
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
