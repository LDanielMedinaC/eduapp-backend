const admin = require('firebase-admin');
const serviceAccount = require('../config/service-account.json');
const ErrorFactory = require('../resources').ErrorFactory;
const Errors = require('../resources').Errors

// Initialize Firebase admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const authFirebase = (req, res, next) => {
    const token = req.headers.authorization;
    const authError = {
        error: ErrorFactory.buildError(Errors.NOT_AUTHORIZED, null, null)
    };

    // Verify a token was provided
    if(!token) {
        return res.status(401).send(authError);
    }

    admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
        if(!decodedToken) {
            return res.status(401).send(authError);
        }

        req.body.uid = decodedToken.uid;
        return next();
    })
    .catch((err) => {
        return res.status(401).send(authError);
    });
};

module.exports = {
    authFirebase
};
