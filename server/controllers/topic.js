const Topic = require('../models').Topic;

function validateTopic(topic) {
    if(!topic.name){
        return {
            status: 400,
            description: 'No name was provided.',
            code: 1
        };
    }
    if(topic.name.length > 50){
        return {
            status: 400,
            description: 'Topic length must be less than 50 characters.',
            code: 2
        };
    }
    if(!topic.field){
        return {
            status: 400,
            description: 'A topic must have a field.',
            code: 3
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
                        code: 10
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