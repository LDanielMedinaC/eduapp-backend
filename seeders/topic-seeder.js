require('dotenv').config();

const Topic = require('../server/models').Topic;
const db = require('../server/models');
const topics = [
    new Topic({
        name: 'Álgebra Lineal',
        field: 'Matemáticas'
    }),
    new Topic({
        name: 'Cálculo Vectorial',
        field: 'Matemáticas'
    }),
    new Topic({
        name: 'Ecuaciones Diferenciales',
        field: 'Matemáticas'
    })
];

let seed = () => {

    console.log('>>> Seeding topics');
    return new Promise(async (resolve) => {
        let seededTopics = topics.map(topic => {
            return new Promise((resolve, reject) => {
                topic.save()
                .then(seededTopic => {
                    resolve(seededTopic);
                })
                .catch(err => {
                    // Ignore topics already in DB
                    if(err.code === 11000 && err.errmsg.includes('name_1')) {
                        resolve(topic);
                    } else {
                        console.log(`Could not add topic: ${err.errmsg || err}`);
                        reject(err);
                    }
                });
            });
        });

        Promise.all(seededTopics)
        .then(() => {
            console.log('All topics seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding topics: ${err}`);
            reject();
        });
    })
}

module.exports = {
    seed
};
