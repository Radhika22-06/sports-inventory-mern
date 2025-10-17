const mongoose = require('mongoose');
const Item = require('./models/Item');
const Issue = require('./models/Issue');
const EquipmentRequest = require('./models/EquipmentRequest');
const Category = require('./models/Category');
require('dotenv').config();

const clearAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear all collections
    await Item.deleteMany({});
    await Issue.deleteMany({});
    await EquipmentRequest.deleteMany({});
    await Category.deleteMany({});
    
    console.log('✅ All previous data cleared successfully!');
    console.log('Now you can start fresh with clean database');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearAllData();