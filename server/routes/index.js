const userController = require("../controllers").user
const landing_pageController = require("../controllers").landingPage

module.exports = (app) => {
    
    // User routes
    app.route('/users')
    .post(userController.create);

    //Landing Page routes
    app.route('/landingpages')
    .get(landing_pageController.show);

    // Catch all the routes. This one must always be at the end.
    app.get('*', (req, res) => res.status(200).send({
        message: 'EduApp backend works!',
    }));
}
