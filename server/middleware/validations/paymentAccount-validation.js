'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;
const methods = require('../../resources').paymentMethods;

const validatePaymentAccount = (req, res, next) => {
    let payment = req.body;

    let requiredFields = [
        'method'
    ];
    
    // Should have study
    if(Object.keys(payment).length === 0) {
        let error = ErrorFactory.buildError(Errors.MISSING_FIELD, 'payment (object)');
        return res.status(error.status).send({ error: error });
    }

    // Required fields
    for(let field of requiredFields) {
        if(req.method == 'POST' && !payment[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    if(payment.method && methods.indexOf(payment.method) == -1){
        let error = ErrorFactory.buildError(Errors.INVALID_FIELD, 'payment method', methods);
        return res.status(error.status).send({error: error});
    }

    next();
};

module.exports = validatePaymentAccount;
