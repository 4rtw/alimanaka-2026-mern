const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
  day: String,
  title: String,
  color: String,
  location: String,
  fidirana: [String],
  vakiteny: [String],
  rakitra: [String],
  fandraisana: Boolean,
  description: [String]
});
module.exports = mongoose.model('Event', EventSchema);
