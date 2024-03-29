require('dotenv').config();
const mongoose = require('mongoose');

const Topic = require('../server/models').Topic;

const topics = [
    new Topic({
        _id: new mongoose.mongo.ObjectId('5db48a252f3af03923defe78'),
        name: 'Álgebra Lineal',
        field: 'Matemáticas',
        tutors: [
            new mongoose.mongo.ObjectId('5db48a252f3af03923defe82'),
            new mongoose.mongo.ObjectId('5db48a252f3af03923defe83')
        ]
    }),
    new Topic({
        _id: new mongoose.mongo.ObjectId('5db48a252f3af03923defe79'),
        name: 'Cálculo Vectorial',
        field: 'Matemáticas',
        tutors: [
            new mongoose.mongo.ObjectId('5db48a252f3af03923defe82')
        ]
    }),
    new Topic({
        _id: new mongoose.mongo.ObjectId('5db48a252f3af03923defe7a'),
        name: 'Ecuaciones Diferenciales',
        field: 'Matemáticas',
        tutors: []
    }),
    new Topic({
        name: 'Smash Avanzado',
        field: 'Ciencias Sociales',
        tutors: []
    })
];

let seed = () => {
    console.log('>>> Seeding topics');

    return new Promise(async (resolve, reject) => {
        let seedingTopics = topics.map(topic => {
            return new Promise((resolve, reject) => {
                topic.save()
                .then(resolve)
                .catch(err => {
                    // Ignore topics already in DB
                    if(err.code === 11000 && err.errmsg.includes('name_1')) {
                        resolve();
                    } else {
                        console.log(`Could not add topic: ${err.errmsg || err}`);
                        reject(err);
                    }
                });
            });
        });

        Promise.all(seedingTopics)
        .then(() => {
            console.log('All topics seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding topics: ${err}`);
            reject();
        });
    });
}

module.exports = {
    seed
};
