'use strict'

const mongoose = require('mongoose');
const User = require('../models').User;
const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors;

module.exports = {
    async list(req, res) {
        let userId = req.params.userId;

        // Validate user exists
        let user = await User.findById(userId).exec();
        if(!user ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user');
            return res.status(error.status).send({ error: error });
        }
        
        if(!user.invoiceInformation){
            user.invoiceInformation = [];
        }

        let invoices = user.invoiceInformation;
        
        return res.status(200).send(invoices);
    },

    async create(req, res){
        let userId = req.params.userId;

        // Validate user exists
        let user = await User.findById(userId).exec();
        if(!user ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user');
            return res.status(error.status).send({ error: error });
        }
        
        if(!user.invoiceInformation){
            user.invoiceInformation = [];
        }

        let invoice = req.body;

        let invoiceInformation = user.invoiceInformation

        if(invoiceInformation == null){
            invoiceInformation = [];
        }

        invoice._id = new mongoose.mongo.ObjectId();

        invoiceInformation.push(invoice);

        
        user.markModified('invoiceInformation');

        user.save()
        .then(() => {
            return res.status(201).send(invoice);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(erro.status).send({error: error});
        });
    },

    async get(req, res){
        let userId = req.params.userId;
        let invoiceId = req.params.invoiceId;

        // Validate user exists
        let user = await User.findById(userId).exec();
        if(!user ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user');
            return res.status(error.status).send({ error: error });
        }
        
        if(!user.invoiceInformation){
            user.invoiceInformation = [];
        }

        let invoices = user.invoiceInformation;

        for(let invoice of invoices){
            if(invoice._id == invoiceId){
                return res.status(200).send(invoice);
            }
        }

        let err = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'invoice information');
        return res.status(err.status).send({error: err});
    },

    async update(req, res){
        let userId = req.params.userId;
        let invoiceId = req.params.invoiceId;

        // Validate user exists
        let user = await User.findById(userId).exec();
        if(!user ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user');
            return res.status(error.status).send({ error: error });
        }
        
        if(!user.invoiceInformation){
            user.invoiceInformation = [];
        }

        let invoices = user.invoiceInformation;

        let finvoices = invoices.filter(invoice => invoice._id == invoiceId);

        if(!finvoices.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'invoice information');
            return res.status(error.status).send({ error: error });
        }

        let invoice = finvoices[0];

        let nInvoice = req.body;

        invoice.rfc = nInvoice.rfc || invoice.rfc;
        invoice.invoiceType = nInvoice.invoiceType || invoice.invoiceType;
        invoice.street = nInvoice.street || invoice.street;
        invoice.extNum = nInvoice.extNum || invoice.extNum;
        invoice.intNum = nInvoice.intNum || invoice.intNum;
        invoice.colony = nInvoice.colony || invoice.colony;
        invoice.country = nInvoice.country || invoice.country;
        invoice.state = nInvoice.state || invoice.state;
        invoice.municipality = nInvoice.municipality || invoice.municipality;
        invoice.pc = nInvoice.pc || invoice.pc;

        user.markModified('invoiceInformation');

        user.save()
        .then(() => {
            return res.status(200).send(invoice);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(error.status).send({error: error});
        })
    },

    async delete(req, res){
        let userId = req.params.userId;
        let invoiceId = req.params.invoiceId;

        // Validate user exists
        let user = await User.findById(userId).exec();
        if(!user ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'user');
            return res.status(error.status).send({ error: error });
        }
        
        if(!user.invoiceInformation){
            user.invoiceInformation = [];
        }

        let invoices = user.invoiceInformation;
        
        let nInvoices = invoices.filter(invoice => invoice._id != invoiceId);

        if(nInvoices.length == invoices.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'invoice information');
            return res.status(error.status).send({ error: error });
        }

        console.log(nInvoices);

        user.invoiceInformation = nInvoices;

        user.markModified('invoiceInformation');

        user.save()
        .then((updatedTutor) => {
            return res.status(200).send(updatedTutor);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(error.status).send({error: error});
        });
    }
}
