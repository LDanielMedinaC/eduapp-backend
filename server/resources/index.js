const ErrorFactory = require('./errorFactory');
const Errors = require('./Errors').Errors; 

const locationTypes = ['Public space', 'Tutor place', 'Student place', 'Online'];
const paymentMethods = ['cash', 'debit card', 'credit card', 'paypal'];
const fields = ['Matemáticas', 'Ciencias Sociales'];
const invoiceTypes = ['Tipo1', 'Tipo2'];

module.exports = {
    ErrorFactory,
    Errors,
    locationTypes,
    paymentMethods,
    fields,
    invoiceTypes
}