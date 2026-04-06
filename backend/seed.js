const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Event } = require('./models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/alimanaka';

// Adjusting path to local file in the same directory or project root
const jsonPath = path.join(__dirname, 'alimanaka_extracted.json');

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding...');

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const eventsToInsert = [];

    // Data is { "2026": { "january": [...], "february": [...] } }
    for (const year in data) {
      for (const month in data[year]) {
        for (const eventData of data[year][month]) {
          eventsToInsert.push({
            year: parseInt(year),
            month: month,
            ...eventData
          });
        }
      }
    }

    await Event.deleteMany({}); // Clear existing data
    await Event.insertMany(eventsToInsert);
    console.log(`Successfully seeded ${eventsToInsert.length} events.`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
