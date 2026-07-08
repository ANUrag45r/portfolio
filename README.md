# Anurag Sinha — Portfolio Website (MongoDB & Node.js)

A production-ready, high-fidelity developer portfolio built from your resume content, featuring:
* **Frontend:** React + Vite + Tailwind CSS + Framer Motion.
* **Backend:** Node.js + Express + MongoDB Atlas (Mongoose) + Socket.IO.
* **Database:** MongoDB Atlas (fully replacing the previous MySQL database).
* **Developer Console:** Real-time resume & skills editor unlocked via passcode, including a secure **Messages Ingestion Console** to view, filter, search, and delete messages.
* **Analytics Engine:** Custom real-time visitor tracker logging visits, page paths, unique users, session durations, and client metadata (IP/GeoIP, Browser/OS), rendered in a landing page dashboard.

---

## Folder Structure

```
portfolio/
├── frontend/          React + Vite + Tailwind (the frontend client)
└── backend/           Express API + Mongoose Models
    ├── models/        MongoDB Schemas (Profile, Project, ContactMessage, VisitorSession)
    ├── routes/        API Routes (profile, projects, skills, contact, analytics)
    └── db/
        └── seed.js    Seeds the MongoDB Atlas cluster with your resume data
```

---

## Technical Specifications & Features

1. **MongoDB Atlas Integration:** All resume content, skills, projects, analytics, and contact messages live in MongoDB. No SQL configuration is needed.
2. **Contact Ingestion Engine:**
   * Validated using **React Hook Form + Zod** schemas on the frontend.
   * Centralized JSON sanitization, rate-limiter protection (max 10 requests per 15 minutes per IP), and central error boundaries.
   * Auto-dispatches email notifications to your inbox using **Nodemailer** (with a silent, robust fallback to FormSubmit API if credentials are unconfigured).
3. **Standalone Admin Messages Page:**
   * Secure standalone dashboard accessible at `/admin/messages` or via the **Messages** tab in the unlocked Developer Console.
   * Provides read-status toggling, reply status tags, text search, pagination, and deletion features.
4. **Real-Time Analytics Dashboard:**
   * Custom tracker captures traffic, unique users, geography, device/OS categories, and active page paths.
   * Direct landing page dashboard displays real-time stats and updates.

---

## Step-by-Step Deployment Guide

Follow these steps to host your portfolio and database live on the web:

### Step 1: Create a Free MongoDB Atlas Database
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Shared Cluster (M0 Free Tier).
3. Under **Network Access**, add IP `0.0.0.0/0` (allows connections from your deployed backend servers like Railway/Render).
4. Under **Database Access**, create a user (e.g. `anuragsinha067`) and write down the password.
5. Click **Connect** → **Connect your application** and copy the SRV connection URI.
   * Example connection URI:
     `mongodb+srv://anuragsinha067:<password>@cluster.mongodb.net/myportfolio?retryWrites=true&w=majority`
   * Replace `<password>` with your database user password (escape special characters if necessary, e.g. `$$` as `%24%24`).

### Step 2: Deploy the Backend to Railway (or Render)
1. Sign up on [Railway.app](https://railway.app/).
2. Click **New Project** → **Deploy from GitHub repository** and select your portfolio repository.
3. In the project settings, specify the Root Directory as `backend`.
4. Add the following **Environment Variables** under the variables settings tab:
   * `NODE_ENV=production`
   * `PORT=5000`
   * `MONGODB_URI=mongodb+srv://anuragsinha067:Anurag_30%24%24@myportfolio.b5ouhjm.mongodb.net/myportfolio?retryWrites=true&w=majority` (Ensure the database password matches)
   * `ADMIN_PASSCODE=anurag` (Passcode to unlock the Developer Console)
   * `JWT_SECRET=your_super_secret_jwt_key` (Used to sign secure admin session tokens)
   * `CORS_ORIGIN=https://your-portfolio-frontend.vercel.app` (Your frontend URL - update this once Vercel is deployed)
   * `EMAIL_USER=nitiananurag20@gmail.com` (Gmail address for Nodemailer alerts)
   * `EMAIL_PASS=your_gmail_app_password` (Gmail app password - generate one in your Google account security settings)
   * `RECEIVER_EMAIL=nitiananurag20@gmail.com`
5. Railway will automatically build and deploy your Express API. Copy the deployed domain URL (e.g., `https://backend-production-xyz.up.railway.app`).

### Step 3: Seed Your Production Database
Once your backend is running, seed the live database with your resume data. You can run the seed script locally pointing to the production MongoDB string, or execute it via a terminal:
```bash
cd backend
# Temporarily set your MONGODB_URI in your local .env to your Atlas production link
npm run seed
```
This inserts your profile, projects list, achievements, and skills into your Atlas cluster.

### Step 4: Deploy the Frontend to Vercel
1. Sign up on [Vercel](https://vercel.com/).
2. Add a **New Project** and import your portfolio repository.
3. Configure the Project:
   * **Framework Preset:** Vite
   * **Root Directory:** `frontend`
4. Add the following **Environment Variable**:
   * `VITE_API_URL=https://backend-production-xyz.up.railway.app/api` (The deployed URL of your Railway backend, ending with `/api`)
5. Click **Deploy**. Vercel will compile the React 19 application and host it.
6. Once deployed, copy your Vercel URL (e.g., `https://your-portfolio-frontend.vercel.app`) and paste it as the `CORS_ORIGIN` variable in your Railway backend settings.

---

## Local Development Setup

If you want to run the project locally:

1. **Clone the Repo & Install Deps:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Configure Local Variables:**
   * Create `backend/.env`:
     ```env
     PORT=5000
     MONGODB_URI='mongodb+srv://anuragsinha067:Anurag_30%24%24@myportfolio.b5ouhjm.mongodb.net/myportfolio?retryWrites=true&w=majority'
     ADMIN_PASSCODE=anurag
     JWT_SECRET=local_jwt_secret_key
     CORS_ORIGIN=http://localhost:5173
     ```
   * Create `frontend/.env`:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Seed & Start:**
   * Seed the database: `npm run seed` inside `backend`
   * Run the API: `npm run dev` inside `backend`
   * Run the Client: `npm run dev` inside `frontend`
   * Open `http://localhost:5173` in your browser.
