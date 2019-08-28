const User = require('../models').User;

function validateUser(user) {
    // Should validate user
}

module.exports = {

    // Method used to create a new user
    create(req, res) {
        // console.log(req.body.user);
        // res.status(200).send('POST /users');

        let user = req.body;

        // Validate name field
        if(!user.name) {
            return res.status(400).send(
                {
                    error: {
                        status: 400,
                        description: 'Me morí',
                        code: 1
                    }
                }
            );
        }

        res.status(200).json('All ok');
    }
}
