# CHAI MYSORE - Quick Start Guide

## Prerequisites
- Node.js installed
- Supabase account (free tier available at https://supabase.com)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at https://supabase.com
   - Go to Project Settings > API
   - Copy your project URL and anon/public key
   - Run the SQL schema from `backend/config/schema.sql` in the Supabase SQL Editor
   - Create a storage bucket named `gallery-images` and make it public

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` file
   - See `.env.example` for all required environment variables

3. Start the server:
```bash
npm start
```

4. Access the application:
- Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Admin Login: username `admin`, password `iahc2025`

## First Steps

1. Login to admin panel
2. Add menu categories (e.g., Beverages, Snacks, Kerala Specials)
3. Add menu items to categories
4. Upload gallery images
5. Toggle price visibility as needed
6. Mark items as "Today's Special"

## Important Notes

- The `.env` file contains your Supabase credentials - keep it secure
- Update WhatsApp number and Instagram handle in the code before deployment
- Gallery images are stored in Supabase Storage
- Admin credentials can be changed in `.env` file

## Deployment

For production deployment:
1. Set up Supabase project (if not already done)
2. Run the SQL schema in Supabase SQL Editor
3. Create the `gallery-images` storage bucket
4. Update `.env` with production Supabase credentials
5. Deploy to hosting service (Vercel, Netlify, Railway, Render, etc.)
6. Ensure environment variables are set on hosting platform
