const Event = require('../models/Event');

const getEvents = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = month.toLowerCase();

    const events = await Event.find(query).sort({ month: 1, date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const getMonths = async (req, res, next) => {
  try {
    const months = await Event.distinct('month');
    res.json(months);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getMonths
};
