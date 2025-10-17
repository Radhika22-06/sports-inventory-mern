const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Role check middleware
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

// Get all items with filters
router.get('/', auth, async (req, res) => {
  try {
    const { sport, brand, stockStatus, search } = req.query;
    let filter = { isActive: true };
    
    if (sport) filter.sport = sport;
    if (brand) filter.brand = brand;
    if (search) filter.name = { $regex: search, $options: 'i' };
    
    let items = await Item.find(filter).sort({ createdAt: -1 });
    
    // Filter by stock status if provided
    if (stockStatus) {
      items = items.filter(item => item.stockStatus === stockStatus);
    }
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock items
router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await Item.find({ isActive: true });
    const lowStockItems = items.filter(item => item.stockStatus === 'low-stock' || item.stockStatus === 'out-of-stock');
    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sports list
router.get('/sports', auth, async (req, res) => {
  try {
    const sports = await Item.distinct('sport', { isActive: true });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get brands list
router.get('/brands', auth, async (req, res) => {
  try {
    const brands = await Item.distinct('brand', { isActive: true });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new item (Admin/Staff only)
router.post('/', auth, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item (Admin/Staff only)
router.put('/:id', auth, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stock quantity
router.patch('/:id/stock', auth, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add', 'subtract', 'set'
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    switch (operation) {
      case 'add':
        item.quantity += quantity;
        break;
      case 'subtract':
        item.quantity = Math.max(0, item.quantity - quantity);
        break;
      case 'set':
        item.quantity = quantity;
        break;
    }
    
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete item (Admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;