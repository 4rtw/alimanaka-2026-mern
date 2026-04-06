const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Event } = require('./models/Event');

// Prefer env var; default works both standalone (localhost) and in Docker
// (docker-compose passes MONGODB_URI, so this fallback is only for local dev)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alimanaka';

const jsonPath = path.join(__dirname, 'alimanaka_extracted.json');

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const eventsToInsert = [];

    for (const year in data) {
      for (const month in data[year]) {
        for (const eventData of data[year][month]) {
          // Clean empty strings — omit rather than store ""
          const clean = { ...eventData };
          if (!clean.day) delete clean.day;
          if (clean.location === '') delete clean.location;
          if (clean.color === null) delete clean.color;

          eventsToInsert.push({
            year: parseInt(year),
            month,
            ...clean,
          });
        }
      }
    }

    await Event.deleteMany({});
    await Event.insertMany(eventsToInsert, { ordered: false });
    console.log(`Successfully seeded ${eventsToInsert.length} events.`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
