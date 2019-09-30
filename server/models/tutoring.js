// Mongoose schema definition for user entity

/*
    Tutoring is a collection, when an user and a tutor agree a class (or tutoring)
    It contains:
    Date = date of the tutoring. Type = Date
    lat = Latitud of the tutoring. Type = Number
    long = Longitud of the tutoring. Type = Number
    Loc = Location of the Tutoring. Type = ['Espacio publico', 'Casa del tutor', 'Casa del alumno', 'Online']
    LocationName = Location's name of the tutoring. Type = string
    Note: lat, long and loc refer to the location of the tutoring 
    Tutor = 
*/

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutoringSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    lat: {
        type: Number
    },
    long: {
        type: Number
    },
    locationType: {
        type: String,
        enum: ['Espacio publico', 'Casa del tutor', 'Casa del alumno', 'Online'],
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    topicID: {
        type: Schema.Types.ObjectId, 
        ref: 'Topic',
        required: true
    },
    tutorID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'debit card', 'credit card', 'paypal'],
        required: true
    }
});

const Tutoring = mongoose.model('Tutoring', tutoringSchema);
module.exports =Tutoring;