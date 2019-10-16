'use strict'

const ObjectId = require('mongoose').Types.ObjectId;
const Errors = require('../../resources').Errors;
const ErrorFactory = require('../../resources').ErrorFactory;
const idRegex = /(\w+Id)/;

const validateIds = (req, res, next) => {
    let idParams = Object.keys(req.params)
    .filter(key => idRegex.test(key))
    .reduce((params, key) => {
        params[key] = req.params[key];
        return params;
    }, {});

    // Missing ids will trigger wildcard route 'No matching route'

    // Validate id is valid ObjectId
    for(let param in idParams) {
        if(!ObjectId.isValid(idParams[param])) {
            let error = ErrorFactory.buildError(Errors.INVALID_ID, idParams[param], param);

            return res.status(error.status).send({ error: error });
        }
    }

    next();
};

module.exports = validateIds;
