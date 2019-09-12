const Topic = require('../models').Topic;

function validateTopic(topic) {
    if(!topic.Name){
        return {
            status: 400,
            description: 'No email was provided.',
            code: 8
        };
    }
    else{
        return null;
    }
    return null;
}

module.exports = {

    // Method used to create a new user
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
        
    }
}