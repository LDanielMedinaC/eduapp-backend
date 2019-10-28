'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateUser = (req, res, next) => {

    let user = req.body;

    let numberComprobation = user.phone.toString();
                
    //Invalid user name

    if(user.name.length < 2 ){
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, user.name, user);
        return res.status(error.status).send({ error: error });
    }else if(user.name.length > 127){
        let error = ErrorFactory.buildError(Errors.LONG_STRING, user.name, user);
        return res.status(error.status).send({ error: error });
    }

    //Invalid name

    let nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚuÜü ]+$/g;
    if(!user.name.match(nameRegex)) {
        let error = ErrorFactory.buildError(Errors.INVALID_CHARSET, user.name, user);

        return res.status(error.status).send({ error: error });
    }


    // Validate phone number
    if(numberComprobation.length < 10) {
        let error = ErrorFactory.buildError(Errors.NUMBER_LOWER_BOUND, user.phone, 10);
        return res.status(error.status).send({ error: error });
    }else if(numberComprobation.length > 10){
        let error = ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, user.phone, 10);
        return res.status(error.status).send({ error: error });
    }

    let phoneRegex = /\d{10,10}/g;
    if(!user.phone.match(phoneRegex)) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, user.phone, 'string');
        return res.status(error.status).send({ error: error });
    }

    // Validate email

    if(user.email.length < 8) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, user.email, 8);
        return res.status(error.status).send({ error: error });
    }else if(user.email.length > 50){
        let error = ErrorFactory.buildError(Errors.LONG_STRING, user.email, 50);
        return res.status(error.status).send({ error: error });
    }

    let emailRegex = /[\w-_\.]+@[\w-_\.]+/g;
    if(!user.email.match(emailRegex)) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, user.email, emailRegex);
        return res.status(error.status).send({ error: error });
    }

    next();
};

module.exports = validateUser;