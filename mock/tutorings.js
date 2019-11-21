'use strict'

const mongoose = require('mongoose');
const Tutoring = require('../server/models').Tutoring;

const tutorings = [
    new Tutoring ({
        _id: new mongoose.mongo.ObjectId('5db4a9ef345e6d3f22a54f68'),
        date: new Date("2020-10-12 00:00:00 (CT)"),
        lat: 19.019635,
        long: -98.246918,
        locationType: 'Casa del tutor',
        locationName: 'Tutor\'s place',
        topicID: '5db48a252f3af03923defe7a',
        tutorId: '5db48a252f3af03923defe82',
        userID: '5db48a252f3af03923defe7c',
        startTime: new Date("2020-10-12 12:00:00 (CT)"),
        endTime: new Date("2020-10-12 23:00:00 (CT)"),
        notes: 'It\'s not the best student',
        paymentMethod: 'cash',
        status: 'requested'
    })
];

module.exports = tutorings;
