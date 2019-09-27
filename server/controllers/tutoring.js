const Tutoring = require('../models').Tutoring;

var td, st, et;

function validateTutoring(tutoring) {
    if(!tutoring.date){
        return {
            status: 400,
            description: 'No date was provided.',
            code: 1
        };
    }
    if(tutoring.date.length != 10){
        return {
            status: 400,
            description: 'The date should be in DD/MM/AAAA format.',
            code: 2
        };
    }
    let dateRegex = /([0-2][0-9]|3[0-1])\/([0][1-9]|1[0-2])\/(20[0-9][0-9])/
    if(tutoring.date.match(dateRegex) === null){
        return {
            status: 400,
            description: 'The date should be in DD/MM/AAAA format. ' + tutoring.date + tutoring.date.match(dateRegex),
            code: 2
        };
    }
    let today = new Date();
    let year = tutoring.date.substring(6, 11);
    let month = parseInt(tutoring.date.substring(3, 5)) -1;
    let day = tutoring.date.substring(0,2)
    td = new Date(year, month, day);
    if(today.getTime() > td.getTime()){
        return {
            status: 400,
            description: 'The date should be in the future.' + td.getDate() + td.getMonth() + td.getFullYear(),
            code: 3
        };
    }
    if(!tutoring.startTime || !tutoring.endTime){
        return {
            status: 400,
            description: 'No time was provided.',
            code: 4
        };
    }
    if(tutoring.startTime.length != 5 || tutoring.endTime.length != 5){
        return {
            status: 400,
            description: 'The time should be in HH:MM format',
            code: 5
        };
    }
    let hourRegex = /^([0-1][0-9]|2[0-3])\:([0-5][0-9])$/
    if(tutoring.startTime.match(hourRegex) == null || tutoring.endTime.match(hourRegex) == null){
        return {
            status: 400,
            description: 'The time should be in HH:MM format',
            code: 5
        };
    }
    let ethh = parseInt(tutoring.endTime.substring(0,2));
    let etmm = parseInt(tutoring.endTime.substring(3,5));
    let sthh = parseInt(tutoring.startTime.substring(0,2));
    let stmm = parseInt(tutoring.startTime.substring(3,5));
    et = new Date(td.getFullYear(), td.getMonth(), td.getDate(), ethh, etmm);
    st = new Date(td.getFullYear(), td.getMonth(), td.getDate(), sthh, stmm);
    if(st.getTime() >= et.getTime()){
        return {
            status: 400,
            description: 'Start time should be before end time.',
            code: 6
        };
    }
    if(!tutoring.locationType || !tutoring.locationName){
        return {
            status: 400,
            description: 'No location provided.',
            code: 7
        };
    }
    if(tutoring.long && tutoring.lat){
        if(tutoring.long < 0 || tutoring.long > 180 || tutoring.lat < 0 || tutoring.lat > 90){
            return {
                status: 400,
                description: 'Invalid coordinates.',
                code: 8
            };
        }
    }
    let locationTypes = ['Espacio publico', 'Casa del tutor', 'Casa del alumno', 'Online'];
    if(locationTypes.indexOf(tutoring.locationType) == -1){
        return {
            status: 400,
            description: 'Invalid location type.',
            code: 9
        };
    }
    if(tutoring.locationName.length < 3 || tutoring.locationName.length > 51){
        return {
            status: 400,
            description: 'Location name should have more than 3 and les than 51 chars.',
            code: 10
        };
    }
    if(!tutoring.notes){
        return {
            status: 400,
            description: 'No notes were provided',
            code: 11
        };
    }
    if(tutoring.notes.length == 0 || tutoring.notes.length > 500){
        return {
            status: 400,
            description: 'Notes should have at least one char and less than 500',
            code: 12
        };
    }
    if(!tutoring.paymentMethod){
        return {
            status: 400,
            description: 'No payment method was provided',
            code: 13
        };
    }
    const methods = ['cash', 'debit card', 'credit card', 'paypal'];
    if(methods.indexOf(tutoring.paymentMethod) == -1){
        return {
            status: 400,
            description: 'Invalid payment method',
            code: 14
        };
    }
    if(!tutoring.topicID){
        return {
            status: 400,
            description: 'No topic provided',
            code: 15
        };
    }
    if(!tutoring.tutorID){
        return {
            status: 400,
            description: 'No tutor provided',
            code: 16
        };
    }
    if(!tutoring.userID){
        return {
            status: 400,
            description: 'No user provided',
            code: 17
        };
    }
    return null;
}

module.exports = {

    // Method used to create a new tutoring
    create(req, res) {
        let tutoring = req.body;

        let validatorError = validateTutoring(tutoring);

        if(validatorError == null){
            // Create app tutoring
            tutoring.date = td;
            tutoring.startTime = st;
            tutoring.endTime = et;
            return new Tutoring(tutoring)
            .save()
            .then((postedTutoring) => {
                res.status(200).send(postedTutoring);
            })
            .catch((err) => {
                res.status(500).send({
                    error: {
                        status: 500,
                        description: `Database error: ${err.errmsg}`,
                        code: 10
                    }
                });
            });
        }
        else{
            return res.status(400).send({
                error: validatorError
            })
        }
        
    }
}