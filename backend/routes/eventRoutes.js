const express = require('express');
const { query } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

router.get('/events',
  validate([
    query('year').optional().isInt().withMessage('Year must be an integer'),
    query('month').optional().isString().withMessage('Month must be a string')
  ]),
  eventController.getEvents
);

router.get('/events/months', eventController.getMonths);

module.exports = router;
