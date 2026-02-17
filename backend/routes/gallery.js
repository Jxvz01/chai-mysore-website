const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabaseAdmin'); // Import admin client
const authMiddleware = require('../middleware/auth');

// Configure multer for memory storage (we'll upload to Supabase Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all gallery images (public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ error: 'Error fetching gallery images' });
    }
});

// Upload image (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique filename
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `gallery-${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;

        // Upload to Supabase Storage using ADMIN client (bypasses RLS)
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('gallery-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(fileName);

        // Save metadata to database using ADMIN client
        const { data: galleryData, error: dbError } = await supabaseAdmin
            .from('gallery')
            .insert([{
                path: publicUrl,
                caption: req.body.caption || ''
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        res.status(201).json(galleryData);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

// Delete image (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Get image data first
        const { data: image, error: fetchError } = await supabase
            .from('gallery')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Extract filename from URL
        const urlParts = image.path.split('/');
        const fileName = urlParts[urlParts.length - 1];

        // Delete from Supabase Storage using ADMIN client
        const { error: storageError } = await supabaseAdmin.storage
            .from('gallery-images')
            .remove([fileName]);

        if (storageError) {
            console.error('Storage delete error:', storageError);
        }

        // Delete from database using ADMIN client
        const { error: dbError } = await supabaseAdmin
            .from('gallery')
            .delete()
            .eq('id', req.params.id);

        if (dbError) throw dbError;

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Error deleting image' });
    }
});

module.exports = router;
