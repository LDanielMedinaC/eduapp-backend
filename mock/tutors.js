'use strict'

const mongoose = require('mongoose');
const User = require('../server/models').User;

const tutors = [
    new User({
        _id: new mongoose.mongo.ObjectId('5db48a252f3af03923defe82'),
        uid: 'abcd123',
        email: 'danperro@tec.mx',
        name: 'Dan Pérez',
        phone: '2223335566',
        country: 'Mexico',
        language: 'es',
        tutorDetails: {
            taughtTopicsIDs: [],
            paymentAccounts: [{
                _id: new mongoose.mongo.ObjectId('abcd91bdc3464f14678934ca'),
                method: 'cash'
            }],
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
                    _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934aa'),
                    institution: 'ITESM',
                    title: 'SCRUM',
                    date: new Date('2016-11-02').toISOString(),
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
    }),
    new User({
        uid: 'abff123456',
        email: 'mkleo@smash.mx',
        name: 'Mak Leonidas',
        phone: '2223335555',
        country: 'Mexico',
        language: 'es',
        tutorDetails: {
            taughtTopicsIDs: [],
            paymentAccounts: [{
                _id: new mongoose.mongo.ObjectId('abcdefbdc3464f14678934ff'),
                method: 'paypal'
            }],
            skills: [],
            workExperience: [],
            studies: [],
            certifications: [{
                _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934bb'),
                institution: 'SSBU Montreal',
                title: 'Neutral JS Básico',
                date: new Date('2018-12-07').toISOString(),
                diplomaURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS4yr_4GeloD1ou0E2acZ-ept3QcunQet9qbu0N-dgvRXyPA9qB'
            }]
        }
    })
];

module.exports = tutors;
