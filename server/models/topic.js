// Mongoose schema definition for landing page 
var mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    Name: {
        type: String, required: [true, 'A topic must have a name'], maxlength: [50, 'Topic length must be less than 50 characters']
    },
    Field: {
        type: String, required: [true, 'A topic must have a field']
    }
}, {
    timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
