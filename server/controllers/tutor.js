const User = require('../models').User;

module.exports = {
    get(req, res) {
        res.status(203).send({
            msg: 'Should get tutors'
        });
    }
};
