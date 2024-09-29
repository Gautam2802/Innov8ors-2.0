// connectDB.js
require("dotenv").config();
const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
