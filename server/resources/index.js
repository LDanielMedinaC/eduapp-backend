const ErrorFactory = require('./errorFactory');
const Errors = require('./Errors').Errors; 

const locationTypes = ['Espacio publico', 'Casa del tutor', 'Casa del alumno', 'Online'];
const paymentMethods = ['cash', 'debit card', 'credit card', 'paypal'];

module.exports = {
    ErrorFactory,
    Errors,
    locationTypes,
    paymentMethods
}