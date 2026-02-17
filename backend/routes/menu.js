const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabaseAdmin'); // Import admin client
const authMiddleware = require('../middleware/auth');

// Get all categories (public)
router.get('/categories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

// Create category (admin only)
router.post('/categories', authMiddleware, async (req, res) => {
    try {
        const { name, displayOrder } = req.body;

        const { data, error } = await supabaseAdmin // Use admin client
            .from('categories')
            .insert([{ name, display_order: displayOrder }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Error creating category' });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', authMiddleware, async (req, res) => {
    try {
        // Cascade delete is handled by database foreign key constraint
        const { error } = await supabaseAdmin // Use admin client
            .from('categories')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Error deleting category' });
    }
});

// Get all menu items (public)
router.get('/items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                category:categories(*)
            `);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Get menu items by category (public)
router.get('/items/category/:categoryId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                category:categories(*)
            `)
            .eq('category_id', req.params.categoryId);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Create menu item (admin only)
router.post('/items', authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, isSpecial, image } = req.body;

        const { data, error } = await supabaseAdmin // Use admin client
            .from('menu_items')
            .insert([{
                name,
                category_id: category,
                price,
                description,
                is_special: isSpecial,
                image
            }])
            .select(`
                *,
                category:categories(*)
            `)
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: 'Error creating menu item' });
    }
});

// Update menu item (admin only)
router.put('/items/:id', authMiddleware, async (req, res) => {
    try {
        const { name, category, price, description, isSpecial, image } = req.body;

        const { data, error } = await supabaseAdmin // Use admin client
            .from('menu_items')
            .update({
                name,
                category_id: category,
                price,
                description,
                is_special: isSpecial,
                image
            })
            .eq('id', req.params.id)
            .select(`
                *,
                category:categories(*)
            `)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Error updating menu item' });
    }
});

// Delete menu item (admin only)
router.delete('/items/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin // Use admin client
            .from('menu_items')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Error deleting menu item' });
    }
});

// Get settings (public)
router.get('/settings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'showPrices')
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Return default if not found
        if (!data) {
            return res.json({ showPrices: true });
        }

        res.json({ showPrices: data.value.enabled });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Error fetching settings' });
    }
});

// Update settings (admin only)
router.put('/settings', authMiddleware, async (req, res) => {
    try {
        const { showPrices } = req.body;

        const { data, error } = await supabaseAdmin // Use admin client
            .from('settings')
            .upsert({
                key: 'showPrices',
                value: { enabled: showPrices },
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        res.json({ showPrices: data.value.enabled });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Error updating settings' });
    }
});

module.exports = router;
