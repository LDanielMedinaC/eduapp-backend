const ErrorFactory = require('./errorFactory');
const Errors = require('./Errors').Errors; 

const locationTypes = ['Public space', 'Tutor place', 'Student place', 'Online'];
const paymentMethods = ['cash', 'debit card', 'credit card', 'paypal'];

module.exports = {
    ErrorFactory,
    Errors,
    locationTypes,
    paymentMethods
}