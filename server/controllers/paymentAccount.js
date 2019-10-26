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

        let methods = tutor.tutorDetails.paymentAccounts;

        return res.status(200).send(methods);
    },

    async create(req, res){
        let tutorId = req.params.tutorId;

        // Validate tutor exists
        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let paymentAccount = req.body;

        let paymentAccounts = tutor.tutorDetails.paymentAccounts

        if(paymentAccounts == null){
            paymentAccounts = [];
        }

        paymentAccount._id = new mongoose.mongo.ObjectId();

        paymentAccounts.push(paymentAccount);

        
        tutor.markModified('tutorDetails.paymentAccounts');

        tutor.save()
        .then(() => {
            return res.status(201).send(paymentAccount);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(erro.status).send({error: error});
        });
    },

    async get(req, res){
        let tutorId = req.params.tutorId;
        let accountId = req.params.accountId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let accounts = tutor.tutorDetails.paymentAccounts;

        for(let account of accounts){
            if(account._id == accountId){
                return res.status(200).send(account);
            }
        }

        let err = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'payment account');
        return res.status(err.status).send({error: err});
    },

    async update(req, res){
        let tutorId = req.params.tutorId;
        let accountId = req.params.accountId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let accounts = tutor.tutorDetails.paymentAccounts;

        let faccounts = accounts.filter(account => account._id == accountId);

        if(!faccounts.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'payment account');
            return res.status(error.status).send({ error: error });
        }

        let account = faccounts[0];

        let nAccount = req.body;

        account.method = nAccount.method || account.method;

        tutor.markModified('tutorDetails.paymentAccounts');

        tutor.save()
        .then(() => {
            return res.status(200).send(account);
        })
        .catch((err) => {
            let error = ErrorFactory.buildError(Errors.DATABASE_ERROR, err);
            return res.status(error.status).send({error: error});
        })
    },

    async delete(req, res){
        let tutorId = req.params.tutorId;
        let accountId = req.params.accountId;

        let tutor = await User.findById(tutorId).exec();
        if(!tutor || !tutor.tutorDetails ) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'tutor');
            return res.status(error.status).send({ error: error });
        }

        let accounts = tutor.tutorDetails.paymentAccounts;
        
        let nAccountS = accounts.filter(account => account._id != accountId);

        if(nAccountS.length == accounts.length) {
            let error = ErrorFactory.buildError(Errors.OBJECT_NOT_FOUND, 'account');
            return res.status(error.status).send({ error: error });
        }

        tutor.tutorDetails.paymentAccounts = nAccountS;

        tutor.markModified('tutorDetails.paymentAccounts');

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
