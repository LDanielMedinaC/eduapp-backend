const authFirebase = require('../middleware/auth').authFirebase;

const userController = require('../controllers').user;
const landingPageController = require('../controllers').landingPage;
const tutorController = require('../controllers').tutor;
const topicController = require('../controllers').topic;
const tutoringController = require('../controllers').tutoring;
const feedbackController = require('../controllers').feedback;
const paymentAccountController = require('../controllers').paymentAccount;
const invoiceController = require('../controllers').invoice;

const validateIds = require('../middleware/validations/ids-validation');
const validateStudy = require('../middleware/validations/study-validation');
const validateCertification = require('../middleware/validations/certification-validation');
const validateWorkExp = require('../middleware/validations/workexperience-validation');
const validateTutoring = require('../middleware/validations/tutoring-validation');
const validateFeedback = require('../middleware/validations/feedback-validation');
const validatePaymentAccount = require('../middleware/validations/paymentAccount-validation');
const validateUser = require('../middleware/validations/user-validation');
const validateInvoice = require('../middleware/validations/invoice-validation');

module.exports = (app) => {
    // Test route
    app.get('/', (req, res) => res.status(200).send({
        message: 'EduApp backend works!',
    }));

    // User routes
    app.route('/users')
    .post(userController.create);
    
    app.route('/users/:userId')
    .get(userController.getDetails)
    .put(validateUser, userController.update);

    //User invoices
    app.route('/users/:userId/invoices')
    .get(validateIds, invoiceController.list)
    .post(validateIds, validateInvoice, invoiceController.create);

    app.route('/users/:userId/invoices/:invoiceId')
    .get(validateIds, invoiceController.get)
    .put(validateIds, validateInvoice, invoiceController.update)
    .delete(validateIds, invoiceController.delete);

    // Landing Page routes
    app.route('/landingpages')
    .get(landingPageController.show)
    .put(landingPageController.update);

    // Tutor routes
    app.route('/tutors')
    .get(tutorController.get);

    app.route('/tutors/:tutorId')
    .get(tutorController.getDetails);

    app.route('/tutors/:tutorId/studies')
    .get(validateIds, tutorController.getStudies)
    .post(validateIds, validateStudy, tutorController.addStudy);

    app.route('/tutors/:tutorId/studies/:studyId')
    .get(validateIds, tutorController.getStudy)
    .patch(validateIds, validateStudy, tutorController.updateStudy)
    .delete(validateIds, tutorController.deleteStudy);

    //Tutor Payment Accounts
    app.route('/tutors/:tutorId/paymentaccounts')
    .get(validateIds, paymentAccountController.list)
    .post(validateIds, validatePaymentAccount, paymentAccountController.create);

    app.route('/tutors/:tutorId/paymentaccounts/:accountId')
    .get(validateIds, paymentAccountController.get)
    .put(validateIds, validatePaymentAccount, paymentAccountController.update)
    .delete(validateIds, paymentAccountController.delete);

    // Tutor certifications
    app.route('/tutors/:tutorId/certifications')
    .get(validateIds, tutorController.getAllCerts)
    .post(validateIds, validateCertification, tutorController.insertCert);

    app.route('/tutors/:tutorId/certifications/:certificationId')
    .get(validateIds, tutorController.getCert)
    .put(validateIds, validateCertification, tutorController.updateCert)
    .delete(validateIds, tutorController.deleteCert);

    // Tutor work experience
    app.route('/tutors/:tutorId/workexperiences')
    .get(validateIds, tutorController.getAllWorkExps)
    .post(validateIds, validateWorkExp, tutorController.insertWorkExp);

    app.route('/tutors/:tutorId/workexperiences/:workexperienceId')
    .get(validateIds, tutorController.getWorkExp)
    .put(validateIds, validateWorkExp, tutorController.updateWorkExp)
    .delete(validateIds, tutorController.deleteWorkExp);

    // Topics routes
    app.route('/topics')
    .get(topicController.list)
    .post(topicController.create);

    // Tutoring routes
    app.route('/tutorings')
    .get(tutoringController.list)    
    .post(validateTutoring.validatePostTutoring, tutoringController.create);

    app.route('/tutorings/:tutoringId')
    .get(validateIds, tutoringController.getDetails);

    // Feedback routes
    app.route('/feedback')
    .post(validateFeedback, feedbackController.forward);

    // Catch all the routes. This one must always be at the end.
    app.all('*', (req, res) => res.status(400).send({
        error: {
            status: 400,
            description: 'Bad request. No matching route.',
            code: 0
        }
    }));
}
