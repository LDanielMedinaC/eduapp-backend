const userController = require("../controllers").user
const landing_pageController = require("../controllers").landingPage

const authFirebase = require('../middleware/auth').authFirebase;

module.exports = (app) => {
    // Test route
    app.get('/', (req, res) => res.status(200).send({
        message: 'EduApp backend works!',
    }));

    // User routes
    app.route('/users')
    .post(userController.create);

    // Landing Page routes
    app.route('/landingpages')
    .get(landing_pageController.show)
    .put(landing_pageController.update);

    // Catch all the routes. This one must always be at the end.
    app.all('*', (req, res) => res.status(400).send({
        error: {
            status: 400,
            description: 'Bad request',
            code: 0
        }
    }));
}
