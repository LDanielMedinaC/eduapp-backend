const userController = require('../controllers').user;
const landingPageController = require('../controllers').landingPage;
const tutorController = require('../controllers').tutor;

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
    .get(landingPageController.show)
    .put(landingPageController.update);

    // Tutor routes
    app.route('/tutors')
    .get(tutorController.get);

    // Catch all the routes. This one must always be at the end.
    app.all('*', (req, res) => res.status(400).send({
        error: {
            status: 400,
            description: 'Bad request',
            code: 0
        }
    }));
}
