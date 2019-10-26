const Tutoring = require('../models').Tutoring;
const User = require('../models').User;
const Topic = require('../models').Topic;
const moongoose = require('mongoose');

const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail-accounts.json');

const ErrorFactory = require('../resources/errorFactory');

module.exports = {

    // Method used to create a new tutoring
    create(req, res) {
        let tutoring = req.body;
        return new Tutoring(tutoring)
        .save()
        .then(async (postedTutoring) => {
            res.status(200).send(postedTutoring);

            // Send email notifying student and tutor
            try {
                let user = await User.findById(postedTutoring.userID);
                let userEmail = user.email;

                let tutor = await User.findById(postedTutoring.tutorID);
                let tutorEmail = tutor.email;

                let topic = await Topic.findById(postedTutoring.topicID);

                let transporter = nodeMailer.createTransport({
                    host: mailConfig.host,
                    port: mailConfig.port,
                    secure: mailConfig.port == 465,
                    auth: mailConfig.auth
                });

                let mailText = `Your ${topic.Name} tutoring has been scheduled with the following details:\n
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
                    description: `Database error: ${err.errmsg || err}`,
                    code: 10
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
                    code: 18
                }
            })
        }

        let tutor = await User.findOne({'_id': tutorID}).exec();

        if(!tutor){
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No tutor matched the provided id',
                    code: 19
                }
            })
        }

        let tutorings = await Tutoring.find({'tutorID': tutorID}).exec();
        return res.status(200).send(tutorings);
    }
}