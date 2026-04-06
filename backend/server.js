const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/alimanaka', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const Event = require('./models/Event');

// API Routes
app.get('/api/events', async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = month.toLowerCase();
    
    const events = await Event.find(query).sort({ month: 1, date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/events/months', async (req, res) => {
  try {
    const months = await Event.distinct('month');
    res.json(months);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
