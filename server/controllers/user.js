const User = require('../models').User;
const Errors = require('../resources').Errors;
const ErrorFactory = require('../resources').ErrorFactory;

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
    },

    // Method used to get an User by ID

    getDetails(req, res){
        let userID = req.params.userId;

        User.findOne({'uid': userID})
        .then((user) => {
            if (!user)
            {   
                let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, userID, user);

                return res.status(error.status).send({ error: error });
            }

            return res.status(200).send(user);
        })
        .catch( (err) => 
        {
            res.status(500).send({
                error: {
                    status: 500,
                    description: `Database error: ${err}`,
                    code: 4
                }
            });
        });
    },

    //Method use to update an user

    update(req, res){
        let user = req.body;

        let userID = req.params.userId;

        User.findOne({'uid': userID})
        .then((us) => {
            if (!us)
            {   
                let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, userID, us);

                return res.status(error.status).send({ error: error });

            } else {
                //User exists, update
                us.name = user.name || us.name;
                us.email = user.email || us.email;
                us.phone = user.phone || us.phone;
                us.country = user.country || us.country;
                us.language = user.language || us.language;

                let number_comprobation = us.phone.toString();
                
                //Invalid user name

                if(us.name.length < 2 ){
                    let error = ErrorFactory.buildError(Errors.SHORT_STRING, us.name, us);

                    return res.status(error.status).send({ error: error });
                }else if(us.name.length > 127){
                    let error = ErrorFactory.buildError(Errors.LONG_STRING, us.name, us);

                    return res.status(error.status).send({ error: error });
                }

                //Invalid name

                let nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚuÜü ]+$/g;
                if(!us.name.match(nameRegex)) {
                    let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, us.name, us);

                    return res.status(error.status).send({ error: error });
                }


                // Validate phone number
                if(number_comprobation.length < 10) {
                    let error = ErrorFactory.buildError(Errors.NUMBER_LOWER_BOUND, us.phone, 10);

                    return res.status(error.status).send({ error: error });
                }else if(number_comprobation.length > 10){
                    let error = ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, us.phone, 10);

                    return res.status(error.status).send({ error: error });
                }

                let phoneRegex = /\d{10,10}/g;
                if(!user.phone.match(phoneRegex)) {
                    let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, us.phone, 'string');

                    return res.status(error.status).send({ error: error });
                }

                // Validate email

                if(us.email.length < 8) {
                    let error = ErrorFactory.buildError(Errors.SHORT_STRING, us.email, 8);

                    return res.status(error.status).send({ error: error });
                }else if(us.email.length > 50){
                    let error = ErrorFactory.buildError(Errors.LONG_STRING, us.name, 50);

                    return res.status(error.status).send({ error: error });
                }

                let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
                if(!us.email.match(emailRegex)) {
                    let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, us.email, emailRegex);

                    return res.status(error.status).send({ error: error });
                }

                //SAVE THE UPDATE

                us.save()
                .then((updatedUser) => res.status(200).send(updatedUser))
                .catch((err) => {
                    res.status(500).send({
                        error: {
                            status: 500,
                            description: `Database error: ${err.errmsg || err}`,
                            code: 0
                        }
                    });
                });


            }
        })
        .catch((err) => {
            res.status(500).send({
                error: {
                    status: 500,
                    description: `Database error: ${err.errmsg}`,
                    code: 2
                }
            });
        });
    }
}
