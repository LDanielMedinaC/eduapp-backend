const ErrorFactory = require('./errorFactory');
const Errors = require('./Errors').Errors; 

const locationTypes = ['Espacio publico', 'Casa del tutor', 'Casa del alumno', 'Online'];
const paymentMethods = ['cash', 'debit card', 'credit card', 'paypal'];
const invoiceTypes = ['Tipo1', 'Tipo2'];

module.exports = {
    ErrorFactory,
    Errors,
    locationTypes,
    paymentMethods,
    invoiceTypes
}