'use strict'

require('dotenv').config();
const Topic = require('../server/models').Topic;
const db = require('../server/models');
const Tutors = require('../mock/tutors');

let seed = () => {
    console.log(">>> Seeding payment methods");
    return new Promise(async (resolve, reject) => {
        let tutor = await Tutors.findOne({'uid': 'abcd123'}).exec();
        tutor.tutorDetails.paymentAccounts = [{method : 'paypal'}, {method : 'debit card'}];
        
    });
};

module.exports = {
    seed
}
