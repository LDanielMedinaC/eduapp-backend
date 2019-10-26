const Tutoring = require('../models').Tutoring;
const User = require('../models').User;
const moongoose = require('mongoose');

const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors

// Method used to create a new tutoring
const create = (req, res) => {
    let tutoring = req.body;
    return new Tutoring(tutoring)
    .save()
    .then((postedTutoring) => {
        res.status(200).send(postedTutoring);
    })
    .catch((err) => {
        res.status(500).send({
            error: {
                status: 500,
                description: `Database error: ${err.errmsg}`,
                code: 10
            }
        });
    });
};

// Method that lists all the tutorings that a tutor has
const list = async (req, res) => {
    let tutorId = req.query.tutorId;

    if(!moongoose.Types.ObjectId.isValid(tutorId)){
        let error = ErrorFactory.buildError(Errors.INVALID_ID, 'tutorID', tutorId);
        return res.status(error.status).send({ error: error })
    }

    let tutor = await User.findOne({'_id': tutorId}).exec();

    if(!tutor){
        return res.status(400).send({
            error: {
                status: 400,
                description: 'No tutor matched the provided id',
                code: 19
            }
        })
    }

    let tutorings = await Tutoring.find({'tutorId': tutorId}).exec();
    return res.status(200).send(tutorings);
}

// Method that retrieves details for tutoring with given id
const getDetails = async (req, res) => {
    let tutoring = await Tutoring.findById(req.params.tutoringId);

    // Tutoring not found
    if(!tutoring) {
        let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutoring');
        return res.status(error.status).send({ error: error });
    }

    return res.status(200).send(tutoring);
};

module.exports = {
    create,
    list,
    getDetails
};
