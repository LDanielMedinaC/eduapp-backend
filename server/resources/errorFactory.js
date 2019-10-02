const Errors = {
    DATABASE_ERROR: 0,
    OBJECT_NOT_FOUND: 1,
    MISSING_FIELD: 2,
    SHORT_STRING: 3,
    INVALID_ID: 4,
    INVALID_DATA_TYPE: 5,
    INVALID_LENGTH: 6,
    INVALID_FORMAT: 7,
    DATE_ORDER: 8,
    NESTED_OBJECT_NOT_FOUND: 9,
    LONG_STRING: 10,
    NUMBER_LOWER_BOUND: 11,
    NUMBER_UPPER_BOUND: 12,
    INVALID_NUMBER: 13,
    INVALID_FIELD: 14,
    INVALID_ENCODING: 15
}

const buildError = (error, arg1, arg2) =>{
    var errorObj = {
        status: 400,
        code: error
    };

    switch(error){
        case Errors.DATABASE_ERROR:{
            errorObj.description = `${arg1}`;
            errorObj.status = 500;
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
            errorObj.description = `${arg1} is not a valid Mongoose ID`;
            break;
        }
        case Errors.INVALID_DATA_TYPE:{
            errorObj.description = `${arg1} is not ${arg2}`;
            break;
        }
        case Errors.INVALID_LENGTH:{
            errorObj.description = `${arg1} should be exactly ${arg2} chars long`;
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
            errorObj.description = `Object ${arg1} not fournd in ${arg2}`;
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
        default:{
            errorObj.code = -1;
            errorObj.description = 'Unknown error';
        }
    }

    return errorObj;
}

module.exports = {

}