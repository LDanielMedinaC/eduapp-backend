require('dotenv').config();

const User = require('../server/models').User;
const Topic = require('../server/models').Topic;
const db = require('../server/models');

let seed = () => {

    console.log('>>> Seeding tutors');
    return new Promise(async (resolve) => {
        let topic = await Topic.findOne({'Name': 'Álgebra Lineal'}).exec();
        let idTopic1 = topic._id;

        topic = await Topic.findOne({'Name': 'Cálculo Vectorial'}).exec();
        let idTopic2 = topic._id;

        topic = await Topic.findOne({'Name': 'Ecuaciones Diferenciales'}).exec();
        let idTopic3 = topic._id;

        const tutors = [
            new User({
                uid: 'abcd123',
                email: 'danperro@tec.mx',
                name: 'Dan Pérez',
                phone: '2223335566',
                country: 'Mexico',
                language: 'es',
                tutorDetails: {
                    taughtTopicsIDs: [
                        idTopic1,
                        idTopic2,
                        idTopic3
                    ],
                    paymentAccounts: [],
                    skills: [],
                    workExperience: [],
                    educationBackground: [],
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
                    taughtTopicsIDs: [
                        idTopic1
                    ],
                    paymentAccounts: [],
                    skills: [],
                    workExperience: [],
                    educationBackground: [],
                    awards: []
                }
            }),
        ];

        let seededTutors = tutors.map(tutor => {
            return new Promise((resolve, reject) => {
                tutor.save()
                .then(seededTutor => {
                    resolve(seededTutor);
                })
                .catch(err => {
                    // Ignore tutors already in DB
                    if(err.code === 11000 && err.errmsg.includes('email_1')) {
                        resolve(tutor);
                    } else {
                        console.log(`Could not add tutor: ${err.errmsg || err}`);
                        reject(err);
                    }
                });
            });
        });

        Promise.all(seededTutors)
        .then(() => {
            console.log('All tutors seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding landing pages: ${err}`);
            reject();
        });
    })
};

module.exports = {
    seed
};
