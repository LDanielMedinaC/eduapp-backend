const Topic = require('../models').Topic;
const Errors = require('../resources').Errors;

function validateTopic(topic) {
    if(!topic.Name){
        return {
            status: 400,
            description: 'No name was provided.',
            code: Errors.MISSING_FIELD
        };
    }
    if(topic.Name.length > 50){
        return {
            status: 400,
            description: 'Topic length must be less than 50 characters.',
            code: Errors.INVALID_LENGTH
        };
    }
    if(!topic.Field){
        return {
            status: 400,
            description: 'A topic must have a field.',
            code: Errors.MISSING_FIELD
        };
    }
    return null;
}

module.exports = {

    // Method used to create a new topic
    create(req, res) {
        let topic = req.body;

        let validatorError = validateTopic(topic);

        if(validatorError == null){
            // Create app topic
            return new Topic(topic)
            .save()
            .then((postedTopic) => {
                res.status(200).send(postedTopic);
            })
            .catch((err) => {
                res.status(500).send({
                    error: {
                        status: 500,
                        description: `Database error: ${err.errmsg}`,
                        code: Errors.DATABASE_ERROR
                    }
                });
            });
        }
        else{
            return res.status(400).send({
                error: validatorError
            })
        }
        
    },

    //Method to list all topics
    list(req, res){

        let topics = Topic.find();

        topics.exec((err, topics) => {
            
            if (err)
            { 
                err.status = 404;
                err.description = "No topics were found";
                err.code = 1;
                res.send(err);
            }
            else
            {
                res.status = 200;
                res.json(topics);
            }
        });
    }
}