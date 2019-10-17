const User = require('../models').User;

function validateUser(user) {
    // Should validate user
}

const Errors = require("../resources").Errors

module.exports = {

    // Method used to create a new user
    create(req, res) {
        let user = req.body;

        // Validate Firebase uid
        if(!user.uid) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: "No Firebase UID was provided.",
                    code: Errors.MISSING_FIELD
                }
            });
        }

        // Validate name field
        if(!user.name) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No user was name provided.',
                    code: Errors.MISSING_FIELD
                }
            });
        }

        if(user.name.length < 2 || user.name.length > 127) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid user name length. Should be [2, 27].',
                    code: Errors.INVALID_LENGTH
                }
            });
        }

        let nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚuÜü ]+$/g;
        if(!user.name.match(nameRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid name. Use Spanish characters.',
                    code: Errors.INVALID_FORMAT
                }
            });
        }

        // Validate phone number
        if(!user.phone) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No phone number was provided.',
                    code: Errors.MISSING_FIELD
                }
            });
        }

        if(user.phone.length != 10) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid phone number. Should be 10-digit.',
                    code: Errors.INVALID_LENGTH
                }
            });
        }

        let phoneRegex = /\d{10,10}/g;
        if(!user.phone.match(phoneRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid phone number.',
                    code: Errors.INVALID_FORMAT
                }
            });
        }

        // Validate email
        if(!user.email) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No email was provided.',
                    code: Errors.MISSING_FIELD
                }
            });
        }

        if(user.email.length < 3 || user.email.length > 320) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email length. Should be [3, 320].',
                    code: Errors.INVALID_LENGTH
                }
            });
        }

        let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
        if(!user.email.match(emailRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email format. Should be user@domain.',
                    code: Errors.INVALID_FORMAT
                }
            });
        }

        // Create app user
        return new User(user)
        .save()
        .then((postedUser) => {
            res.status(200).send(postedUser);
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
    }
}
