'use strict'

let ErrorFactory = require('../../resources').ErrorFactory;
let Errors = require('../../resources').Errors;

const validateWorkexperience = (req, res, next) => {
    let workExp = req.body;

    let requiredFields = [
        'institution',
        'department',
        'beginDate',
        'endDate'
    ];
    
    //Validate required fields
    for(let field of requiredFields) {
        if((req.method == 'POST' || req.method == 'PUT') && !workExp[field]) {
            let error = ErrorFactory.buildError(Errors.MISSING_FIELD, field);
            return res.status(error.status).send({ error: error });
        }
    }

    //Add stillWorking if not set
    if (!workExp.stillWorking)
        workExp.stillWorking = false;

    // Institution min length 2 characters
    if(workExp.institution.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'institution', '2');
        return res.status(error.status).send({ error: error });
    }

    // Department min length 2 characters
    if(workExp.department.length < 2) {
        let error = ErrorFactory.buildError(Errors.SHORT_STRING, 'department', '2');
        return res.status(error.status).send({ error: error });
    }

    // BeginDate should be valid date format
    if(!Date.parse(workExp.beginDate)) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, 'beginDate', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    // EndDate should be valid date format
    if(!Date.parse(workExp.endDate)) {
        let error = ErrorFactory.buildError(Errors.INVALID_FORMAT, 'endDate', 'ISO8601 format');
        return res.status(error.status).send({ error: error });
    }

    //beginDate should be in the past
    let now = new Date();
    if (!(Date.parse(workExp.beginDate) < now))
    {
        let error = ErrorFactory.buildError(Errors.DATE_IN_FUTURE, 'beginDate', now.toString());
        return res.status(error.status).send({ error: error });
    }

    //endDate only matters if tutor is no longer working there
    if (!workExp.stillWorking)
    {
        //endDate should be in the past
        if(!(Date.parse(workExp.endDate) < now)) 
        {
            let error = ErrorFactory.buildError(Errors.DATE_IN_FUTURE, 'endDate', now.toString());
            return res.status(error.status).send({ error: error });
        }

        // endDate should be after beginDate
        let beginDate = Date.parse(workExp.beginDate);
        let endDate = Date.parse(workExp.endDate);
        if(beginDate >= endDate) {
            let error = ErrorFactory.buildError(Errors.DATE_ORDER, 'endDate', 'beginDate')
            return res.status(error.status).send({ error: error });
        }
    }
    

    next();
};

module.exports = validateWorkexperience;