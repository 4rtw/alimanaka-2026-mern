const mongoose = require('mongoose');
const LITURGICAL_COLORS = ['white', 'green', 'red', 'purple', 'brown', 'yellow', 'black'];
const MONTH_ORDER = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12
};

const EventSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: String, required: true, enum: Object.keys(MONTH_ORDER) },
  date: { type: String, required: true },
  day: String,
  title: String,
  color: { type: String, enum: [...LITURGICAL_COLORS, null] },
  location: String,
  fidirana: [String],
  vakiteny: [String],
  rakitra: [String],
  fandraisana: Boolean,
  description: [String]
}, { timestamps: true });

// Compound index for the primary query pattern
EventSchema.index({ year: 1, month: 1, date: 1 });

// Static method to return events sorted chronologically
EventSchema.statics.findChronological = function(query) {
  return this.find(query).lean().then(events => {
    return events.sort((a, b) => {
      const monthDiff = (MONTH_ORDER[a.month] || 0) - (MONTH_ORDER[b.month] || 0);
      if (monthDiff !== 0) return monthDiff;
      return parseInt(a.date.split(/[-–]/)[0]) - parseInt(b.date.split(/[-–]/)[0]);
    });
  });
};

module.exports = { Event: mongoose.model('Event', EventSchema), MONTH_ORDER, LITURGICAL_COLORS };
