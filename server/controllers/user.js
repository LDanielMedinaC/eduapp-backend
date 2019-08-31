const User = require('../models').User;

function validateUser(user) {
    // Should validate user
}

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
                    code: 11
                }
            });
        }

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

        let nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚuÜü ]+$/g;
        if(!user.name.match(nameRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid name. Use Spanish characters.',
                    code: 3
                }
            });
        }

        // Validate phone number
        if(!user.phone) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No phone number was provided.',
                    code: 5
                }
            });
        }

        if(user.phone.length != 10) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid phone number. Should be 10-digit.',
                    code: 4
                }
            });
        }

        let phoneRegex = /\d{10,10}/g;
        if(!user.phone.match(phoneRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid phone number.',
                    code: 6
                }
            });
        }

        // Validate email
        if(!user.email) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'No email was provided.',
                    code: 8
                }
            });
        }

        if(user.email.length < 3 || user.email.length > 320) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email length. Should be [3, 320].',
                    code: 7
                }
            });
        }

        let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
        if(!user.email.match(emailRegex)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    description: 'Invalid email format. Should be user@domain.',
                    code: 9
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
                    code: 10
                }
            });
        });
    }
}
