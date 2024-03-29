require('dotenv').config();
const mongoose = require('mongoose');

const Topic = require('../server/models').Topic;
const db = require('../server/models');
const tutors = require('../mock/tutors');

let seed = () => {

    console.log('>>> Seeding tutors');
    return new Promise(async (resolve) => {
        let topic = await Topic.findOne({'name': 'Álgebra Lineal'}).exec();
        let idTopic1 = topic._id;

        topic = await Topic.findOne({'name': 'Cálculo Vectorial'}).exec();
        let idTopic2 = topic._id;

        topic = await Topic.findOne({'name': 'Ecuaciones Diferenciales'}).exec();
        let idTopic3 = topic._id;

        if(tutors[0]) {
            let skills = tutors[0].tutorDetails.skills;
            skills.push({
                _id: new mongoose.mongo.ObjectId('5de553854d21e64b51fcedee'),
                topic: new mongoose.mongo.ObjectId(idTopic1),
                experience: 10
            });

            skills.push({
                _id: new mongoose.mongo.ObjectId('5de553854d21e64b51fcedef'),
                topic: new mongoose.mongo.ObjectId(idTopic2),
                experience: 2
            });
        }

        if(tutors[1]) {
            let skills = tutors[1].tutorDetails.skills;
            skills.push({
                _id: new mongoose.mongo.ObjectId('5de553854d21e64b51fcedf0'),
                topic: new mongoose.mongo.ObjectId(idTopic1),
                experience: 3
            });
        }

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
