'use strict'

const User = require('../server/models').User;

const tutors = [
    new User({
        uid: 'abcd123',
        email: 'danperro@tec.mx',
        name: 'Dan Pérez',
        phone: '2223335566',
        country: 'Mexico',
        language: 'es',
        tutorDetails: {
            taughtTopicsIDs: [],
            paymentAccounts: [],
            skills: [],
            workExperience: [],
            studies: [],
            awards: []
        }
    }),
    new User({
        uid: 'abff123',
        email: 'angel@tutor.mx',
        name: 'Angel Gecko',
        phone: '2223335577',
        country: 'Mexico',
        language: 'es',
        tutorDetails: {
            taughtTopicsIDs: [],
            paymentAccounts: [],
            skills: [],
            workExperience: [],
            studies: [],
            awards: []
        }
    })
];

module.exports = tutors;
