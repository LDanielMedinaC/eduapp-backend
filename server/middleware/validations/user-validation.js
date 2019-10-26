'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateUser = (req, res, next) => {

    let us = req.body;

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
    if(!us.phone.match(phoneRegex)) {
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

    next();
};

module.exports = validateUser;