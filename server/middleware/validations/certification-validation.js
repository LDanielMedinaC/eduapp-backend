'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateCertification = (req, res, next) => {
    let cert = req.body;

    let requiredFields = [
        'institution',
        'title',
        'date',
    ];
    
    //Validate required fields
    for(let field of requiredFields) {
        if((req.method == 'POST' || req.method == 'PUT') && !cert[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    // Institution min length 2 characters
    if(cert.institution.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'institution', '2');
        return res.status(error.status).send({ error: error });
    }

    // Title min length 2 characters
    if(cert.title.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'title', '2');
        return res.status(error.status).send({ error: error });
    }

    // date should be valid date format
    if(!Date.parse(cert.date) /*|| cert.date.length != 10 || !(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(cert.date))*/ ) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, 'date', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    //Date should be in the past
    let now = new Date();
    if (!(Date.parse(cert.date) < now))
    {
        let error = ErrorFactory.buildError(Errors.DATE_IN_FUTURE, 'date', now.toString());
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateCertification;