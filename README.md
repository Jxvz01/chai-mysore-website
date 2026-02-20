☕ CHAI MYSORE

Dynamic Café Website with Admin Panel (Node.js + Supabase)

A modern, fully dynamic café website built with Node.js and Supabase.
Manage menu items, categories, specials, and gallery images directly from an admin dashboard without touching the code.

🚀 Features

Dynamic menu management

Category-based organization

“Today’s Special” toggle

Optional price visibility control

Gallery image upload (Supabase Storage)

Secure admin dashboard

WhatsApp & Instagram integration ready

Deployment-ready for modern hosting platforms

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js + Express

Database: Supabase (PostgreSQL)

Storage: Supabase Storage

📦 Prerequisites

Node.js (v18+ recommended)

Supabase account (https://supabase.com
)

⚙️ Installation
1. Clone the Repository
git clone https://github.com/your-username/chai-mysore.git
cd chai-mysore
2. Install Dependencies
npm install
🗄 Supabase Setup

Create a new project in Supabase

Go to Project Settings → API

Copy:

Project URL

Anon/Public Key

Open SQL Editor

Run the schema file located at:

backend/config/schema.sql

Go to Storage

Create a bucket named:

gallery-images

Set the bucket to Public

🔐 Environment Variables

Copy the example file:

cp .env.example .env

Update the following values inside .env:

SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_public_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

⚠️ Do not commit the .env file to GitHub.

▶️ Run the Project
npm start
🌐 Access the Application

Website:

http://localhost:3000

Admin Panel:

http://localhost:3000/admin
🧭 Admin Setup Guide

After logging in:

Add Menu Categories (e.g., Beverages, Snacks, Kerala Specials)

Add Menu Items under each category

Upload gallery images

Toggle price visibility if required

Mark items as “Today’s Special”

All updates reflect instantly on the website.

🚀 Deployment

For production deployment:

Set up Supabase project

Run the SQL schema in Supabase

Create the gallery-images storage bucket

Update .env with production credentials

Deploy to a hosting platform:

Vercel

Netlify

Railway

Render

Set environment variables in your hosting platform dashboard

🔒 Security Notes

Keep your .env file secure

Use strong admin credentials

Consider enabling Supabase Row Level Security (RLS)

Restrict storage access properly in production
