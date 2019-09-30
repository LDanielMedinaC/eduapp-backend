require('dotenv').config();

const Tutoring = require('../server/models').Tutoring;
const User = require('../server/models').User;
const Topic = require('../server/models').Topic;


let seed = () => {
    return new Promise(async (resolve, reject) => {
        let topic = await Topic.findOne({'Name': 'Álgebra Lineal'}).exec();
        let idTopic1 = topic._id;
        let user = await User.findOne({'uid': 'usuario3'}).exec();
        let userId = user._id;
        let tutor = await User.findOne({'uid': 'abcd123'}).exec();
        let tutorID = tutor._id;

        const tutorings = [
            new Tutoring ({
                date: new Date("2020-10-12 00:00:00 (CT)"),
                lat: 19.019635,
                long: -98.246918,
                locationType: 'Casa del tutor',
                locationName: 'Tutor\'s place',
                topicID: idTopic1,
                tutorID: tutorID,
                userID: userId,
                startTime: new Date("2020-10-12 12:00:00 (CT)"),
                endTime: new Date("2020-10-12 23:00:00 (CT)"),
                notes: 'It\'s not the best student',
                paymentMethod: 'cash',
                status: 'requested'
            })
        ];

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
