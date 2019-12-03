const Errors = require('./Errors').Errors;

const buildError = (error, arg1, arg2) =>{
    var errorObj = {
        status: 400,
        code: error
    };

    switch(error){
        case Errors.DATABASE_ERROR: {
            errorObj.description = `${arg1}`;
            errorObj.status = 500;
            break;
        }
        case Errors.CLIENT_ERROR: {
            errorObj.description = arg1 ? arg1 : 'Client error';
            errorObj.status = 400;
            break;
        }
        case Errors.OBJECT_NOT_FOUND:{
            errorObj.description = `Object ${arg1} not found`;
            errorObj.status = 404;
            break;
        }
        case Errors.MISSING_FIELD:{
            errorObj.description = `Field ${arg1} is missing`;
            break;
        }
        case Errors.SHORT_STRING:{
            errorObj.description = `Field ${arg1} length is too short. Min ${arg2} chars`;
            break;
        }
        case Errors.INVALID_ID:{
            errorObj.description = `${arg1} (${arg2}) is not a valid ObjectId`;
            break;
        }
        case Errors.INVALID_DATA_TYPE:{
            errorObj.description = `${arg1} is not ${arg2}`;
            break;
        }
        case Errors.INVALID_LENGTH:{
            errorObj.description = `${arg1} should have length ${arg2}`;
            break;
        }
        case Errors.INVALID_FORMAT:{
            errorObj.description = `${arg1} should follow ${arg2} format`;
            break;
        }
        case Errors.DATE_ORDER:{
            errorObj.description = `${arg1} should be after ${arg2}`;
            break;
        }
        case Errors.NESTED_OBJECT_NOT_FOUND:{
            errorObj.description = `Object ${arg1} not found in ${arg2}`;
            break;
        }
        case Errors.LONG_STRING:{
            errorObj.description = `Field ${arg1} length is too long. Max ${arg2} chars`;
            break;
        }
        case Errors.NUMBER_LOWER_BOUND:{
            errorObj.description = `Field ${arg1} is too small. Min ${arg2} `;
            break;
        }
        case Errors.NUMBER_UPPER_BOUND:{
            errorObj.description = `Field ${arg1} is too big. Max ${arg2}`;
            break;
        }
        case Errors.INVALID_NUMBER:{
            errorObj.description = `Field ${arg1} should be ${arg2}`;
            break;
        }
        case Errors.INVALID_FIELD:{
            errorObj.description = `Field ${arg1} should belong to ${arg2} enum`;
            break;
        }
        case Errors.INVALID_ENCODING:{
            errorObj.description = `Field ${arg1} should use ${arg2}`;
            break;
        }
        case Errors.NOT_AUTHORIZED:{
            errorObj.description = `Not authorized`;
            errorObj.status = 401;
            break;
        }
        case Errors.INVALID_URL: {
            errorObj.description = `Field \'${arg1}\' requires a valid URL.`;
            break;
        }
        case Errors.DATE_IN_FUTURE: {
            errorObj.description = `Date \'${arg1}\' cannot be in the future. Current date: ${arg2}`;
            break;
        }
        case Errors.INVALID_CHARSET: {
            errorObj.description = `Field ${arg1} should use ${arg2} characters`;
            break;
        }
        default:{
            errorObj.code = -1;
            errorObj.description = 'Unknown error' + (arg1 ? `: ${arg1}` : '');
            errorObj.status = 500;
        }
    }

    return errorObj;
}

module.exports = {
    buildError
}