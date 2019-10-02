'use strict'

const ObjectId = require('mongoose').Types.ObjectId;
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
            let error = {
                status: 400,
                description: `${idParams[param]} is not a valid id for ${param}`,
                code: 1
            };

            return res.status(error.status).send({ err: error });
        }
    }

    next();
};

module.exports = validateIds;
