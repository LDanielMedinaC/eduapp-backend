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
            studies: [{
                institution: 'Alguna Universidad',
                degree: 'Licenciatura',
                field: 'Aerospace',
                grade: 100,
                startDate: new Date('1980-01-01'),
                endDate: new Date('1984-12-31'),
                proofDocURL: 'https://storage.provider.com/items/asd123dfg456',
                validationDate: new Date('2019-01-01')
            }],
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
