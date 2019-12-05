// Mongoose schema definition for topic
var mongoose = require('mongoose');
let fields = require('../resources').fields;

const topicSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'A topic must have a name'], maxlength: [50, 'Topic length must be less than 50 characters'], unique: true
    },
    field: {
        type: String, required: [true, 'A topic must have a field'],
        enum: fields
    },
    tutors: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
}, {
    timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
