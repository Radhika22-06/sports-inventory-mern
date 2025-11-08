const express = require('express');
const Category = require('../models/Category');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get items by category
router.get('/:categoryName/items', auth, async (req, res) => {
  try {
    const items = await Item.find({ 
      sport: req.params.categoryName, 
      isActive: true 
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new category (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;