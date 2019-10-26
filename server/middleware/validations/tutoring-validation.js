'use strict'

const ObjectId = require('mongoose').Types.ObjectId;
const Errors = require('../../resources').Errors;
const ErrorFactory = require('../../resources').ErrorFactory;
const locationTypes = require('../../resources').locationTypes;
const paymentMethods = require('../../resources').paymentMethods;
const User = require('../../models').User;
const Topic = require('../../models').Topic;

const validateTutoring = async (tutoring, required, td, st, et) => {
    if(!tutoring.date && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'date', null);
    if((!tutoring.startTime || !tutoring.endTime) && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'time', null);
    if((!tutoring.locationType || !tutoring.locationName) && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'location', null);
    if(!tutoring.notes && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'notes', null);
    if(!tutoring.paymentMethod && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'payment method', null);
    if(!tutoring.topicID && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'topic id', null);
    if(!tutoring.tutorId && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'tutor id', null);
    if(!tutoring.userID && required)
        return ErrorFactory.buildError(Errors.MISSING_FIELD, 'user id', null);
    if(tutoring.date){
        if(tutoring.date.length != 10)
            return ErrorFactory.buildError(Errors.INVALID_FORMAT, 'date', 'DD/MM/AAAA');
        let year = tutoring.date.substring(6, 11);
        let month = tutoring.date.substring(3, 5);
        let day = tutoring.date.substring(0,2);
        let today = new Date();
        let timestamp = Date.parse(year + "-" + month + "-" + day + " 00:00:00 (CT)");
        if(isNaN(timestamp))
            return ErrorFactory.buildError(Errors.INVALID_FORMAT, 'date', 'DD/MM/AAAA');
        td = new Date(year + "-" + month + "-" + day + " 00:00:00 (CT)");
        if(today.getTime() > td.getTime())
            return ErrorFactory.buildError(Errors.DATE_ORDER, 'date', 'today');
        tutoring.date = td;
    }
    let hourRegex = /^([0-1][0-9]|2[0-3])\:([0-5][0-9])$/;
    if(tutoring.startTime){
        if(tutoring.startTime.match(hourRegex) == null)
            return ErrorFactory.buildError(Errors.INVALID_FORMAT, 'start time', 'HH:MM');
        let sthh = tutoring.startTime.substring(0,2);
        let stmm = tutoring.startTime.substring(3,5);
        st = new Date(td.getYear() + "-" + (td.getMonth() + 1) + "-" + td.getDate() + " " + sthh + ":" + stmm + ":00 (CT)");
        tutoring.startTime = st;
    }
    if(tutoring.endTime){
        if(tutoring.endTime.match(hourRegex) == null)
            return ErrorFactory.buildError(Errors.INVALID_FORMAT, 'end time', 'HH:MM');
        let ethh = tutoring.endTime.substring(0,2);
        let etmm = tutoring.endTime.substring(3,5);
        et = new Date(td.getYear() + "-" + (td.getMonth() + 1) + "-" + td.getDate() + " " + ethh + ":" + etmm + ":00 (CT)");
        tutoring.endTime = et;
    }
    if(st.getTime() >= et.getTime())
        return ErrorFactory.buildError(Errors.DATE_ORDER, 'end time', 'start time');
    if(tutoring.long){
        if(tutoring.long < -180)
            return ErrorFactory.buildError(Errors.NUMBER_LOWER_BOUND, 'longitud', '-180');
        if(tutoring.long > 180)
            return ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, 'longitud', '180');
    }
    if(tutoring.lat){
        if(tutoring.lat < -90)
            return ErrorFactory.buildError(Errors.NUMBER_LOWER_BOUND, 'latitud', '-90');
        if(tutoring.lat > 90)
            return ErrorFactory.buildError(Errors.NUMBER_UPPER_BOUND, 'latitud', '90');
    }
    if(tutoring.locationType && locationTypes.indexOf(tutoring.locationType) == -1)
        return ErrorFactory.buildError(Errors.INVALID_FIELD, 'location type', 'locationTypes');
    if(tutoring.locationName){
        if(tutoring.locationName.length < 3)
            return ErrorFactory.buildError(Errors.SHORT_STRING, 'location name', '3');
        if(tutoring.locationName.length > 51)
            return ErrorFactory.buildError(Errors.LONG_STRING, 'location name', '51');
    }
    if(tutoring.notes){
        if(tutoring.notes.length == 0)
            return ErrorFactory.buildError(Errors.SHORT_STRING, 'notes', '1');
        if(tutoring.notes.length > 500)
            return ErrorFactory.buildError(Errors.LONG_STRING, 'notes', '500');
    }
    if(tutoring.paymentMethod && paymentMethods.indexOf(tutoring.paymentMethod) == -1)
        return ErrorFactory.buildError(Errors.INVALID_FIELD, 'payment method', 'paymentMethods');
    if(tutoring.topicID && !ObjectId.isValid(tutoring.topicID))
        return ErrorFactory.buildError(Errors.INVALID_ID, 'topicID', tutoring.topicID);
    if(tutoring.userID && !ObjectId.isValid(tutoring.userID))
        return ErrorFactory.buildError(Errors.INVALID_ID, 'userID', tutoring.userID);
    if(tutoring.tutorId && !ObjectId.isValid(tutoring.tutorId))
        return ErrorFactory.buildError(Errors.INVALID_ID, 'tutorId', tutoring.tutorId);
    if(tutoring.topicID){
        let topic = await Topic.findById(tutoring.topicID);
        if(!topic)
            return ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'topic', null);
    }
    if(tutoring.userID){
        let user = await User.findById(tutoring.userID);
        if(!user)
            return ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user', null);
    }
    if(tutoring.tutorId){
        let tutor = await User.findById(tutoring.tutorId);
        if(!tutor || !tutor.tutorDetails)
            return ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor', null);
    }
    return null;
}

const validatePostTutoring = async (req, res, next) => {

    let tutoring = req.body;

    let validatorError = await validateTutoring(tutoring, true, null, null, null);
    tutoring.status = 'requested'
    
    if(validatorError != null){
        return res.status(validatorError.status).send({error: validatorError});
    }

    next();
};

module.exports = {
    validatePostTutoring
}
