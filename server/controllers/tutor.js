const User = require('../models').User;

module.exports = {
    get(req, res) {
        if(req.query.topic) {
            // Look for topic id
            // return tutors
        }

        // Return all tutors
        User.where('tutorDetails').ne(null).exec()
        .then(tutors => {
            res.status(200).send(tutors);
        });
    }
};
