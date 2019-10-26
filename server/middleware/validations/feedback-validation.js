'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateFeedback = (req, res, next) => {
    let feedback = req.body;

    let requiredFields = [
        'name',
        'email',
        'comment'
    ];

    // Should have feedback object
    if(Object.keys(feedback).length === 0) {
        let error = ErrorFactory.buildError(Errors.MISSING_FIELD, 'feedback (object)');
        return res.status(error.status).send({ error: error });
    }

    // Required fields
    for(let field of requiredFields) {
        if(!feedback[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    // Name length should be in [2, 127]
    if(feedback.name.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'name', '2');
        return res.status(error.status).send({ error: error });
    }
    if(feedback.name.length > 127) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'name', '127');
        return res.status(error.status).send({ error: error });
    }

    // Name should have only Spanish characters
    let nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚuÜü ]+$/g;
    if(!feedback.name.match(nameRegex)) {
        let error = ErrorFactory.buildError(Errors.INVALID_CHARSET, 'name', 'Spanish');
        return res.status(error.status).send({ error: error });
    }

    // Email length should be in [3, 320]
    if(feedback.email.length < 3) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'email', '3');
        return res.status(error.status).send({ error: error });
    }
    if(feedback.email.length > 320) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'email', '320');
        return res.status(error.status).send({ error: error });
    }

    // Email should be well-formed address
    let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
    if(!feedback.email.match(emailRegex)) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, 'email', '<user>@<domain>');
        return res.status(error.status).send({ error: error });
    }

    // Comment length should be in [3, 240]
    if(feedback.comment.length < 3) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'comment', '3');
        return res.status(error.status).send({ error: error });
    }
    if(feedback.comment.length > 240) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'comment', '240');
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateFeedback;
