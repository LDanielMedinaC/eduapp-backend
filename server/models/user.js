// Mongoose schema definition for user entity
var mongoose = require('mongoose');
const paymentMethods = require('../resources').paymentMethods;
const invoiceTypes = require('../resources/index').invoiceTypes;

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    country: {
        type: String
    },
    language: {
        type: String
    },
    invoiceInformation: {
        type: [{
            rfc:{
                type: String,
                required: true
            },
            invoiceType: {
                type: String,
                enum: invoiceTypes,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            extNum: {
                type: Number,
                required: true
            },
            intNum: {
                type: Number
            },
            colony: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            state:{
                type: String,
                required: true
            },
            municipality:{
                type: String,
                required: true
            },
            pc: {
                type: String,
                required: true
            }
        }]
    },
    tutorDetails: {
        type: {
            taughtTopicsIds: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Topic'
            }],
            paymentAccounts: {
                type: [{
                    method: {
                        type: String,
                        enum: paymentMethods
                    }
                }]
            },
            skills: {
                type: [{
                    placeHolder: {
                        type: String
                    }
                }]
            },
            workExperiences: {
                type: [{
                    placeHolder: {
                        type: String
                    }
                }]
            },
            studies: {
                type: [{
                    institution: {
                        required: true,
                        type: String,
                    },
                    degree: {
                        required: true,
                        type: String,
                    },
                    field: {
                        required: true,
                        type: String,
                    },
                    grade: {
                        required: true,
                        type: Number,
                    },
                    startDate: {
                        required: true,
                        type: Date,
                        validate: [datesOrder, 'endDate should be after startDate']
                    },
                    endDate: {
                        required: true,
                        type: Date,
                        validate: [datesOrder, 'endDate should be after startDate']
                    },
                    proofDocURL: {},
                    validationDate: {
                        required: true,
                        type: Date
                    }
                }]
            },
            certifications: {
                type: [{
                    institution: {
                        type: String,
                        required: true
                    },
                    title: {
                        type: String,
                        required: true
                    },
                    date: {
                        type: Date,
                        required: true
                    },
                    diplomaURL: {
                        type: String
                    }
                }]
            }

        }
    }
});

function datesOrder() {
    return this.endDate > this.startDate;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
