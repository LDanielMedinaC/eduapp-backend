require('dotenv').config();

var User = require('../server/models').User;
var models = require('../server/models');

let seed = () => {
    models.connectDB()
    .then(async () => {
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

        let seedeUsers = users.map(user => {
            return new Promise((resolve, reject) => {
                user.save()
                .then(seedeUser => {
                    resolve(seedeUser);
                })
                .catch(err => {
                    if(err.code === 11000 && err.errmsg.includes('email_1')) {
                        resolve(user);
                    } else {
                        console.log(`Could not add user: ${err.errmsg || err}`);
                        reject(err);
                    }
                })
            })
        });

        Promise.all(seedeUsers)
        .then(() => {
            console.log('DONE :3');
            models.disconnectDB();
        })
        .catch(err => {
            console.log(`Something went wrong: ${err}`);
            models.disconnectDB();
        });
    })
    .catch((err) => {
        console.log(`Something broke: ${err}`);
    })
}

module.exports = seed;