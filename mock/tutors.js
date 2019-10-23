'use strict'

const mongoose = require('mongoose');
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
                _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca'),
                institution: 'Alguna Universidad',
                degree: 'Licenciatura',
                field: 'Aerospace',
                grade: 100,
                startDate: new Date('1980-01-01').toISOString(),
                endDate: new Date('1984-12-31').toISOString(),
                proofDocURL: 'https://storage.provider.com/items/asd123dfg456',
                validationDate: new Date('2019-01-01').toISOString()
            }],
            certifications: [
                {
                    institution: 'ITESM',
                    title: 'SCRUM',
                    date: new Date('2016-11-02'),
                    diplomaURL: 'http::gcloud/bucket/12454545bcd/item/a4555d121'
                }
            ]
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
            certifications: []
        }
    })
];

module.exports = tutors;
