const userController = require('../controllers').user;
const landingPageController = require('../controllers').landingPage;
const tutorController = require('../controllers').tutor;
const topicController = require('../controllers').topic;
const authFirebase = require('../middleware/auth').authFirebase;
const tutoringController = require('../controllers').tutoring;

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

    app.route('/tutors/:id')
    .get(tutorController.getDetails);

    app.route('/tutors/:id/studies')
    .get(tutorController.getStudies)
    .post(tutorController.addStudy);

    app.route('/tutors/:tutorId/studies/:studyId')
    .get(tutorController.getStudy);

    // Topics routes
    app.route('/topics')
    .get(topicController.list)
    .post(topicController.create);

    //Tutoring routes
    app.route('/tutorings')
    .get(tutoringController.list)    
    .post(tutoringController.create)

    // Catch all the routes. This one must always be at the end.
    app.all('*', (req, res) => res.status(400).send({
        error: {
            status: 400,
            description: 'Bad request. Not matching route.',
            code: 0
        }
    }));
}
