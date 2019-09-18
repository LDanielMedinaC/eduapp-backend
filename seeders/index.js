'use strict'

require('dotenv').config();
const db = require('../server/models');

const seeders = [
    require('./user-seeder'),
    require('./landingpage-seeder')
];

const seedAll = () => {
    console.log('SEEDING...');

    return new Promise(async (resolve, reject) => {
        try {
            for(let seeder of seeders)
                await seeder.seed();
            
            resolve();
        } catch(err) {
            console.log(`Failed while seeding a model: ${err}`);
            reject();
        }
    });
};

db.connectDB()
.then(seedAll)
.then(() => {
    console.log('DONE! 🐱');
    db.disconnectDB();
})
.catch((err) => {
    console.log(`Something went wrong :(`);
    db.disconnectDB();
});
