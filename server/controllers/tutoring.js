const Tutoring = require('../models').Tutoring;
const User = require('../models').User;
const moongoose = require('mongoose');

const Errors = require('../resources').Errors;

module.exports = {

    // Method used to create a new tutoring
    create(req, res) {
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
                    code: Errors.DATABASE_ERROR
                }
            });
        });
    },

    //Methdo that list al the tutorings that a tutor has
    async list(req, res){
        let tutorID = req.query.tutorID;

        if(!moongoose.Types.ObjectId.isValid(tutorID)){
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid ID',
                    code: Errors.INVALID_ID
                }
            })
        }

        let tutor = await User.findOne({'_id': tutorID}).exec();

        if(!tutor){
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No tutor matched the provided id',
                    code: Errors.NESTED_OBJECT_NOT_FOUND
                }
            })
        }

        let tutorings = await Tutoring.find({'tutorID': tutorID}).exec();
        return res.status(200).send(tutorings);
    }
}