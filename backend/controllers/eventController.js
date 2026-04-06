const { Event } = require('../models/Event');

const getEvents = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (year) {
      const y = parseInt(year);
      if (!isNaN(y)) query.year = y;
    }
    if (month) query.month = month.toLowerCase();

    const events = await Event.findChronological(query);
    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const getMonths = async (req, res, next) => {
  try {
    const months = await Event.distinct('month');
    const monthOrder = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    res.set('Cache-Control', 'public, max-age=604800');
    res.json(months);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getMonths
};
