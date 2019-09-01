var User = require('../server/models/user');

var mongoose = require('mongoose');

mongoose.connect('localhost/27017/example', { useNewUrlParser: true });

var users = [
    new User({
        email: 'hector_great@itesm.mx',
        name: 'Hector Suarez',
        phone: 2223454546,
        password: 'password1',
        country: 'Mexico',
        language: 'Español'
    }),
    new User({
        email: 'erika_great@itesm.mx',
        name: 'Erika Martinez',
        phone: 2223454521,
        password: 'password2',
        country: 'Mexico',
        language: 'Español'
    }),
    new User({
        email: 'juancho_great@itesm.mx',
        name: 'Juan Jesus',
        phone: 2223454532,
        password: 'password3',
        country: 'Mexico',
        language: 'Español'
    })
];

var done = 0;
for (var i = 0; i < users.length; i++){
    users[i].save(function(err, result) {
        done++;
        if(done === users.length){
            exit();
        }        
    });
}

function exit(){
    mongoose.disconnect();
}