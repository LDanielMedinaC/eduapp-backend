'use strict'

const mongoose = require('mongoose');
const User = require('../models').User;
const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors;

module.exports = {
    async list(req, res) {
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }
        
        if(!tutor.tutorDetails.invoiceInformation){
            tutor.tutorDetails.invoiceInformation = [];
        }

        let invoices = tutor.tutorDetails.invoiceInformation;
        
        return res.status(200).send(invoices);
    },

    async create(req, res){
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let invoice = req.body;

        if(!tutor.tutorDetails.invoiceInformation){
            tutor.tutorDetails.invoiceInformation = [];
        }

        let invoiceInformation = tutor.tutorDetails.invoiceInformation

        if(invoiceInformation == null){
            invoiceInformation = [];
        }

        invoice._id = new mongoose.mongo.ObjectId();

        invoiceInformation.push(invoice);

        
        tutor.markModified('tutorDetails.invoiceInformation');

        tutor.save()
        .then(() => {
            return res.status(201).send(invoice);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(erro.status).send({error: error});
        });
    },

    async get(req, res){
        let tutorId = req.params.tutorId;
        let invoiceId = req.params.invoiceId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        if(!tutor.tutorDetails.invoiceInformation){
            tutor.tutorDetails.invoiceInformation = [];
        }

        let invoices = tutor.tutorDetails.invoiceInformation;

        for(let invoice of invoices){
            if(invoice._id == invoiceId){
                return res.status(200).send(invoice);
            }
        }

        let err = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'invoice information');
        return res.status(err.status).send({error: err});
    },

    async update(req, res){
        let tutorId = req.params.tutorId;
        let invoiceId = req.params.invoiceId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        if(!tutor.tutorDetails.invoiceInformation){
            tutor.tutorDetails.invoiceInformation = [];
        }

        let invoices = tutor.tutorDetails.invoiceInformation;

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

        tutor.markModified('tutorDetails.invoiceInformation');

        tutor.save()
        .then(() => {
            return res.status(200).send(invoice);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(error.status).send({error: error});
        })
    },

    async delete(req, res){
        let tutorId = req.params.tutorId;
        let invoiceId = req.params.invoiceId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        if(!tutor.tutorDetails.invoiceInformation){
            tutor.tutorDetails.invoiceInformation = [];
        }

        let invoices = tutor.tutorDetails.invoiceInformation;
        
        let nInvoices = invoices.filter(invoice => invoice._id != invoiceId);

        if(nInvoices.length == invoices.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'invoice information');
            return res.status(error.status).send({ error: error });
        }

        console.log(nInvoices);

        tutor.tutorDetails.invoiceInformation = nInvoices;

        tutor.markModified('tutorDetails.invoiceInformation');

        tutor.save()
        .then((updatedTutor) => {
            return res.status(200).send(updatedTutor);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(error.status).send({error: error});
        });
    }
}
