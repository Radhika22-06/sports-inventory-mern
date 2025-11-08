const mongoose = require('mongoose');

// Test MongoDB connection
const testConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Testing MongoDB connection...');
    console.log('URI:', uri ? 'URI exists' : 'URI missing');
    
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();