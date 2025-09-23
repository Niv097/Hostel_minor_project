require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // no extra options needed
        console.log('✅ Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectToMongo;
