require('dotenv').config();
const mongoose = require('mongoose');

const Tutoring = require('../server/models').Tutoring;
const User = require('../server/models').User;
const Topic = require('../server/models').Topic;

const tutorings = require('../mock/tutorings');

let seed = () => {
    return new Promise(async (resolve, reject) => {
        console.log('>>> Seeding tutorings');
        let seedingTutorings = tutorings.map(tutoring => {
            return new Promise((resolve, reject) => {
                tutoring.save()
                .then(seedingTutorings => {
                    resolve(seedingTutorings)
                })
                .catch(err => {
                    // Ignore tutorings already in DB
                    if(err.code === 11000 && err.errmsg.includes('name_1')) {
                        resolve(tutoring);
                    } else {
                        console.log(`Could not add tutoring: ${err.errmsg || err}`);
                        reject(err);
                    }
                });
            });
        });

        Promise.all(seedingTutorings)
        .then(() => {
            console.log('All tutorings seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding tutorings: ${err}`);
            reject();
        });
    });
};

module.exports = {
    seed
};
