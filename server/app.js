const express = require('express');

// Set up the express app
const app = express();

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'EduApp backend works!',
}));

module.exports = app;
