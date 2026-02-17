# Deployment Guide: Chai Mysore

This guide helps you deploy the Chai Mysore website (Frontend + Backend) to **Vercel**.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account to host the code.
2.  **Vercel Account**: You can sign up using your GitHub account.
3.  **Supabase Project**: You already have this set up.

## Step 1: Push Code to GitHub

Since you already have a local project, you need to push it to a GitHub repository.

1.  Create a **new repository** on GitHub (e.g., `chai-mysore`).
2.  Run these commands in your terminal (if you haven't already linked it):

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Link to your new GitHub repo (replace URL with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/chai-mysore.git

# Push to GitHub
git push -u origin main
```

## Step 2: Import to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select the `chai-mysore` repository you just created.
4.  Click **"Import"**.

## Step 3: Configure Project

Vercel will detect the settings automatically, but we need to set the **Environment Variables**.

1.  **Framework Preset**: Leave as "Other" or "Node.js" (Vercel usually detects it).
2.  **Root Directory**: Leave as `./` (default).
3.  **Environment Variables**:
    Expand the "Environment Variables" section and add the following keys from your `.env` file:

    | Key | Value (Copy from your local .env) |
    | :--- | :--- |
    | `SUPABASE_URL` | `https://...` |
    | `SUPABASE_ANON_KEY` | `eyJ...` (The public key) |
    | `SUPABASE_SERVICE_KEY` | `eyJ...` (The secret service role key) |
    | `JWT_SECRET` | `chai_mysore_...` (Your secret key) |
    | `ADMIN_USERNAME` | `admin` |
    | `ADMIN_PASSWORD` | `iahc2025` |

    *Note: You don't need `PORT` as Vercel handles that.*

## Step 4: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to finish.
3.  Once deployed, Vercel will give you a domain (e.g., `chai-mysore.vercel.app`).

## Verification

1.  Visit your new URL.
2.  Go to `/admin` to test the admin panel.
3.  Try uploading an image to the gallery.

## Troubleshooting

-   **500 Errors**: Check the "Logs" tab in Vercel to see backend errors.
-   **Images not loading**: Ensure your Supabase bucket is "Public".
-   **Login failing**: Verify `JWT_SECRET` and Admin credentials are correct in Vercel Environment Variables.
