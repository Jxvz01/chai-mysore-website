# Supabase Setup Guide for Chai Mysore

Follow these steps to set up your Supabase backend for the Chai Mysore website.

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in the details:
   - **Name**: chai-mysore (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for it to initialize

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `backend/config/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. You should see success messages for all tables created

## Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Enter bucket name: `gallery-images`
4. Make it **Public** (toggle the public option)
5. Click "Create bucket"

## Step 4: Get API Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. Copy both of these values

## Step 5: Update Environment Variables

1. Open the `.env` file in your project root
2. Update these values:
   ```env
   SUPABASE_URL=<paste your Project URL here>
   SUPABASE_ANON_KEY=<paste your anon key here>
   ```
3. Save the file

## Step 6: Create Admin User (First Login)

The admin user will be created automatically on first login attempt:
1. Start your server: `npm start`
2. Go to http://localhost:3000/admin
3. Login with the credentials from your `.env` file:
   - Username: `admin` (or whatever you set in `ADMIN_USERNAME`)
   - Password: `iahc2025` (or whatever you set in `ADMIN_PASSWORD`)

The system will automatically create a Supabase Auth user for you on first login.

## Verification

After setup, verify everything works:

1. **Database Tables**: Go to Table Editor in Supabase and confirm you see:
   - categories
   - menu_items
   - gallery
   - settings

2. **Storage**: Go to Storage and confirm you see the `gallery-images` bucket

3. **Admin Login**: Try logging into the admin panel

## Troubleshooting

### "Invalid API key" error
- Double-check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes

### Tables not created
- Re-run the SQL schema in the SQL Editor
- Check for any error messages in the SQL Editor

### Gallery upload fails
- Verify the `gallery-images` bucket exists and is set to **Public**
- Check Storage policies in Supabase dashboard

### Admin login fails
- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in `.env`
- Check browser console for error messages
- Verify Supabase Auth is enabled (it should be by default)

## Next Steps

Once setup is complete:
1. Add menu categories
2. Add menu items
3. Upload gallery images
4. Customize contact information in the frontend
