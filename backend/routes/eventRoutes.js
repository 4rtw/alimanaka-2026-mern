const express = require('express');
const { query, validationResult } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');

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

// Literal paths — order doesn't matter for exact matches, but keep specific first for clarity
router.get('/events/months', eventController.getMonths);

router.get('/events',
  validate([
    query('year').optional().isInt().withMessage('Year must be an integer'),
    query('month').optional().isString().withMessage('Month must be a string')
  ]),
  eventController.getEvents
);

module.exports = router;
