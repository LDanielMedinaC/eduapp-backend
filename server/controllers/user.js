const User = require('../models').User;

function validateUser(user) {
    // Should validate user
}

module.exports = {

    // Method used to create a new user
    create(req, res) {
        let user = req.body;

        // Validate name field
        if(!user.name) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No user was name provided.',
                    code: 2
                }
            });
        }

        if(user.name.length < 2 || user.name.length > 127) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid user name length. Should be [2, 27].',
                    code: 1
                }
            });
        }

        // Validate phone number
        if(!user.phone) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No phone number was provided.',
                    code: 4
                }
            });
        }

        if(user.phone.length != 10) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid phone number. Should be 10-digit.',
                    code: 3
                }
            });
        }

        // Validate email
        if(!user.email) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No email was provided.',
                    code: 6
                }
            });
        }

        if(user.email.length < 3 || user.email.length > 320) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email length. Should be [3, 320].',
                    code: 5
                }
            });
        }

        let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
        if(!user.email.match(emailRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email format. Should be user@domain.',
                    code: 7
                }
            });
        }

        new User({name:'Rafa'})
        .save()
        .then(() => {
            res.status(200).json('All ok');
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    }
}
