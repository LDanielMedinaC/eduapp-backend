const Tutoring = require('../models').Tutoring;
const User = require('../models').User;
const Topic = require('../models').Topic;
const moongoose = require('mongoose');

const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail-accounts.json');

const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors

// Method used to create a new tutoring
const create = (req, res) => {
    let tutoring = req.body;
    return new Tutoring(tutoring)
    .save()
    .then(async (postedTutoring) => {
        res.status(200).send(postedTutoring);

        // Send email notifying student and tutor
        try {
            let user = await User.findById(postedTutoring.userId);
            let userEmail = user.email;

            let tutor = await User.findById(postedTutoring.tutorId);
            let tutorEmail = tutor.email;

            let topic = await Topic.findById(postedTutoring.topicId);

            let transporter = nodeMailer.createTransport({
                host: mailConfig.host,
                port: mailConfig.port,
                secure: mailConfig.port == 465,
                auth: mailConfig.auth
            });

            let mailText = `Your ${topic.name} tutoring has been scheduled with the following details:\n
            Date: ${new Date(postedTutoring.date).toDateString()}
            Time: ${new Date(postedTutoring.startTime).toTimeString()}\n
            Location: ${postedTutoring.locationName}
            Payment method: ${postedTutoring.paymentMethod}
            Notes: ${postedTutoring.notes}`;

            let mailOptions = {
                from: process.env.NODE_ENV === 'production' ? mailConfig.auth.user : `EduApp <noreply@eduapp.com>`,
                to: `${userEmail}, ${tutorEmail}`,
                subject: 'Your tutoring has been scheduled!',
                text: mailText
            };

            let mailInfo = await transporter.sendMail(mailOptions);
   
            if(process.env.NODE_ENV !== 'production') {
                console.log(`Message sent: ${mailInfo.messageId}`);
                console.log(`Preview URL: ${nodeMailer.getTestMessageUrl(mailInfo)}`);
            }
        } catch(err) {
            return console.log(err.msg || err);
        }
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
        let error = ErrorFactory.buildError(Errors.INVALID_ID, 'tutorId', tutorId);
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
