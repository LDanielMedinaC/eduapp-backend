require('dotenv').config();

const Topic = require('../server/models').Topic;

const topics = [
    new Topic({
        Name: 'Álgebra Lineal',
        Field: 'Matemáticas'
    }),
    new Topic({
        Name: 'Cálculo Vectorial',
        Field: 'Matemáticas'
    }),
    new Topic({
        Name: 'Ecuaciones Diferenciales',
        Field: 'Matemáticas'
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
