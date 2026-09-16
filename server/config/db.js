const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    mongoose.set('bufferCommands', false);
    console.warn('MONGO_URI is not configured; starting API without MongoDB.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.warn('MongoDB connection unavailable; API will use client-side local persistence:', err.message);
    return false;
  }
};

module.exports = connectDB;
