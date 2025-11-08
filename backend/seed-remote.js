const mongoose = require('mongoose');
const Category = require('./models/Category');

// Use production MongoDB URI
const MONGODB_URI = 'mongodb+srv://admin:RadhaJi478%2523@cluster0.mongodb.net/sports_inventory?retryWrites=true&w=majority';

const categories = [
  { name: 'Cricket', description: 'Cricket equipment and accessories' },
  { name: 'Football', description: 'Football gear and equipment' },
  { name: 'Badminton', description: 'Badminton rackets and shuttlecocks' },
  { name: 'Basketball', description: 'Basketball equipment and accessories' },
  { name: 'Tennis', description: 'Tennis rackets and balls' },
  { name: 'Swimming', description: 'Swimming gear and accessories' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Category.deleteMany({});
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();