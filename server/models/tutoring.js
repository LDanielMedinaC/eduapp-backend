// Mongoose schema definition for user entity
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