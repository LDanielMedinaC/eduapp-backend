const userController = require("../controllers").user
const landing_pageController = require("../controllers").landing_page

module.exports = (app) => {
    
    // User routes
    app.route('/users')
    .post(userController.create);

    // Catch all the routes. This one must always be at the end.
    app.get('*', (req, res) => res.status(200).send({
        message: 'EduApp backend works!',
    }));
}
