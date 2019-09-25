require('dotenv').config();

var User = require('../server/models').User;

const users = [
    new User({
        uid: 'usuario1',
        email: 'hector_great@itesm.mx',
        name: 'Hector Suarez',
        phone: 2223454546,
        password: 'password1',
        country: 'Mexico',
        language: 'Español'
    }),
    new User({
        uid: 'usuario2',
        email: 'erika_great@itesm.mx',
        name: 'Erika Martinez',
        phone: 2223454521,
        password: 'password2',
        country: 'Mexico',
        language: 'Español'
    }),
    new User({
        uid: 'usuario3',
        email: 'juancho_great@itesm.mx',
        name: 'Juan Jesus',
        phone: 2223454532,
        password: 'password3',
        country: 'Mexico',
        language: 'Español'
    })
];

let seed = () => {
    console.log('>>> Seeding Users');

    return new Promise(async (resolve, reject) => {
        let seedingUsers = users.map((user) => {
            return new Promise((resolve, reject) => {
                user.save()
                .then(resolve)
                .catch(err => {
                    if(err.code === 11000 && (err.errmsg.includes('email_1') || err.errmsg.includes('uid_1'))) {
                        resolve();
                    } else {
                        console.log(`Could not add user: ${err.errmsg || err}`);
                        reject(err);
                    }
                });
            });
        });

        Promise.all(seedingUsers)
        .then(() => {
            // All users successfully seeded
            console.log('All users seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding users: ${err}`);
            reject();
        });
    });
}

module.exports = {
    seed
};
