'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;
let invoiceTypes = require('../../resources').invoiceTypes;

const validateInvoice = (req, res, next) => {
    let invoice = req.body;

    let requiredFields = [
        'rfc',
        'invoiceType',
        'street',
        'extNum',
        'colony',
        'country',
        'state',
        'municipality',
        'city',
        'pc'
    ];
    
    // Should have invoice data
    if(Object.keys(invoice).length === 0) {
        let error = ErrorFactory.buildError(Errors.MISSING_FIELD, 'invoice (object)');
        return res.status(error.status).send({ error: error });
    }

    // Required fields
    for(let field of requiredFields) {
        if(req.method == 'POST' && !invoice[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    // Invoice format
    if(invoice.rfc) {
        let rfc = invoice.rfc;
        if(rfc.length < 10){
            let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'rfc', '10');
            return res.status(error.status).send({ error: error });
        }   
        if(rfc.length > 13){
            let error = ErrorFactory.buildError(Errors.LONG_STRING, 'rfc', '13');
            return res.status(error.status).send({ error: error });
        }  
        //TODO check reg exp   
        /*let regExp = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;
        if(rfc.match(regExp) == null){
            let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, 'rfc', 'RFC');
            return res.status(error.status).send({ error: error });
        } */
    }

    // Invoice type validation
    if(invoice.invoiceType && invoiceTypes.indexOf(invoice.invoiceType) == -1) {
        let error = ErrorFactory.buildError(Errors.INVALID_FIELD, 'invoice', invoiceTypes);
        return res.status(error.status).send({ error: error });
    }

    // Stree max length 255 characters
    if(invoice.street && invoice.street > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'street', '255');
        return res.status(error.status).send({ error: error });
    }

    // Ext Number is an integer
    if(invoice.extNum) {
        if(!Number.isInteger(invoice.extNum)){
            let error = ErrorFactory.buildError(Errors.INVALID_DATA_TYPE, `${invoice.extNum} (exterior number)`, 'an integer');
            return res.status(error.status).send({ error: error });
        }
        if(invoice.extNum > 99999){
            let error = ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, `${invoice.extNum} (exterior number)`, '99999');
            return res.status(error.status).send({ error: error });
        }
    }

    // Int Number is an integer
    if(invoice.intNum) {
        if(!Number.isInteger(invoice.intNum)){
            let error = ErrorFactory.buildError(Errors.INVALID_DATA_TYPE, `${invoice.intNum} (interior number)`, 'an integer');
            return res.status(error.status).send({ error: error });
        }
        if(invoice.intNum > 99999){
            let error = ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, `${invoice.intNum} (interior number)`, '99999');
            return res.status(error.status).send({ error: error });
        }
    }

    // Colony max length 255 characters
    if(invoice.colony && invoice.colony > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'colony', '255');
        return res.status(error.status).send({ error: error });
    }

    // Country max length 255 characters
    if(invoice.country && invoice.country > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'country', '255');
        return res.status(error.status).send({ error: error });
    }

    // State max length 255 characters
    if(invoice.state && invoice.state > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'state', '255');
        return res.status(error.status).send({ error: error });
    }

    // City max length 255 characters
    if(invoice.city && invoice.city > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'city', '255');
        return res.status(error.status).send({ error: error });
    }

    // Municipality max length 255 characters
    if(invoice.municipality && invoice.municipality > 255) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'municipality', '255');
        return res.status(error.status).send({ error: error });
    }

    // PC max length 10 characters
    if(invoice.pc && invoice.pc.length > 10) {
        let error = ErrorFactory.buildError(Errors.LONG_STRING, 'P.C.', '10');
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateInvoice;
