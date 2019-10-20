'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;
let topicFields = require('../../resources').fields;

const validateSkill = (req, res, next) => {
    let skill = req.body;

    let requiredFields = [
        'name',
        'experience',
        'field',
    ];
    
    // Should have skill
    if(Object.keys(skill).length === 0) {
        let error = ErrorFactory.buildError(Errors.MISSING_FIELD, 'skill (object)');
        return res.status(error.status).send({ error: error });
    }

    // Required fields
    for(let field of requiredFields) {
        if(req.method == 'POST' && !skill[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    // Name min length 2 characters
    if(skill.name && study.institution.name <= 1) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'name', '1');
        return res.status(error.status).send({ error: error });
    }

    // Name max length 50 characters
    if(skill.name && study.institution.name >= 50) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'name', '50');
        return res.status(error.status).send({ error: error });
    }

    // Name min length 2 characters
    if(skill.field && topicFields.indexOf(skill.field) == -1) {
        let error = ErrorFactory.buildError(Errors.INVALID_FIELD, 'field', topicFields);
        return res.status(error.status).send({ error: error });
    }

    //Experience lower bound
    if(skill.experience && skill.experience < 0){
        let error = ErrorFactory.buildError(Errors.NUMBER_LOWER_BOUND, 'experience', '0');
        return res.status(error.status).send({ error: error });
    }

    //Experience upper bound
    if(skill.experience && skill >= 100){
        let error = ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, 'experience', '99');
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateSkill;
