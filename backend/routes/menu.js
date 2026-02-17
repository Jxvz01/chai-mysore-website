const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/auth');

// Get all categories (public)
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ displayOrder: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

// Create category (admin only)
router.post('/categories', authMiddleware, async (req, res) => {
    try {
        const { name, displayOrder } = req.body;
        const category = new Category({ name, displayOrder });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', authMiddleware, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        // Also delete all menu items in this category
        await MenuItem.deleteMany({ category: req.params.id });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
});

// Get all menu items (public)
router.get('/items', async (req, res) => {
    try {
        const items = await MenuItem.find().populate('category');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Get menu items by category (public)
router.get('/items/category/:categoryId', async (req, res) => {
    try {
        const items = await MenuItem.find({ category: req.params.categoryId }).populate('category');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Create menu item (admin only)
router.post('/items', authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, isSpecial, image } = req.body;
        const menuItem = new MenuItem({ name, category, price, description, isSpecial, image });
        await menuItem.save();
        const populatedItem = await MenuItem.findById(menuItem._id).populate('category');
        res.status(201).json(populatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Error creating menu item' });
    }
});

// Update menu item (admin only)
router.put('/items/:id', authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, isSpecial, image } = req.body;
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { name, category, price, description, isSpecial, image },
            { new: true }
        ).populate('category');
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating menu item' });
    }
});

// Delete menu item (admin only)
router.delete('/items/:id', authMiddleware, async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting menu item' });
    }
});

// Get settings (public)
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching settings' });
    }
});

// Update settings (admin only)
router.put('/settings', authMiddleware, async (req, res) => {
    try {
        const { showPrices } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        settings.showPrices = showPrices;
        settings.updatedAt = Date.now();
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Error updating settings' });
    }
});

module.exports = router;
