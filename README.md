# CHAI MYSORE - Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB:
- Copy `.env.example` to `.env`
- Update the `MONGODB_URI` in `.env` file with your MongoDB Atlas connection string
- See `.env.example` for required environment variables

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

- The `.env` file contains your MongoDB connection string - keep it secure
- Update WhatsApp number and Instagram handle in the code before deployment
- Gallery images are stored in `frontend/assets/uploads/`
- Admin credentials can be changed in `.env` file

## Deployment

For production deployment:
1. Set up MongoDB Atlas cluster
2. Update `.env` with production MongoDB URI
3. Deploy to hosting service (Heroku, Railway, Render, etc.)
4. Ensure environment variables are set on hosting platform
