'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateStudy = (req, res, next) => {
    let study = req.body;

    let requiredFields = [
        'institution',
        'degree',
        'field',
        'grade',
        'startDate',
        'endDate',
        'validationDate'
    ];
    
    // Should have study
    if(Object.keys(study).length === 0) {
        let error = ErrorFactory.buildError(Errors.MISSING_FIELD, 'study (object)');
        return res.status(error.status).send({ error: error });
    }

    // Required fields
    for(let field of requiredFields) {
        if(req.method == 'POST' && !study[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    // Institution min length 2 characters
    if(study.institution && study.institution.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'institution', '2');
        return res.status(error.status).send({ error: error });
    }

    // Degree min length 2 characters
    if(study.degree && study.degree.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'degree', '2');
        return res.status(error.status).send({ error: error });
    }

    // Field min length 2 characters
    if(study.field && study.field.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'field', '2');
        return res.status(error.status).send({ error: error });
    }

    // Grade is an integer
    if(study.grade && !Number.isInteger(study.grade)) {
        let error = ErrorFactory.buildError(Errors.INVALID_DATA_TYPE, `${study.grade} (grade)`, 'an integer');
        return res.status(error.status).send({ error: error });
    }

    // Grade length is 1 or 2
    if(study.grade && ((study.grade + '').length < 1 || (study.grade + '').length > 2)) {
        let error = ErrorFactory.buildError(Errors.INVALID_LENGTH, 'grade', '1 or 2');
        return res.status(error.status).send({ error: error });
    }

    // startDate should be valid date
    if(study.startDate && !Date.parse(study.startDate)) {
        let error = ErrorFactory.buildError(Errors.INVALID_ENCODING, 'startDate', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    // endDate should be valid date
    if(study.endDate && !Date.parse(study.endDate)) {
        let error = ErrorFactory.buildError(Errors.INVALID_ENCODING, 'endDate', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    // endDate should be after startDate
    let startDate = Date.parse(study.startDate);
    let endDate = Date.parse(study.endDate);
    if(startDate >= endDate) {
        let error = ErrorFactory.buildError(Errors.DATE_ORDER, 'endDate', 'startDate')
        return res.status(error.status).send({ error: error });
    }

    // validationDate should be valid date
    if(study.validationDate && !Date.parse(study.validationDate)) {
        let error = ErrorFactory.buildError(Errors.INVALID_ENCODING, 'validationDate', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    // validationDate should be after or equals endDate
    let validationDate = Date.parse(study.validationDate);
    if(endDate > validationDate) {
        let error = ErrorFactory.buildError(Errors.DATE_ORDER, 'endDate', 'startDate')
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateStudy;
