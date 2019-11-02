// Mongoose schema definition for topic
var mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'A topic must have a name'], maxlength: [50, 'Topic length must be less than 50 characters'], unique: true
    },
    Field: {
        type: String, required: [true, 'A topic must have a field']
    }
}, {
    timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
