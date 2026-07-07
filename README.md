# Anurag Sinha — Portfolio Website

Full-stack portfolio built from your resume: **React (Vite) frontend** + **Express backend** + **MySQL database**. All content (experience, projects, skills, achievements) lives in MySQL, so you can add/edit anything later without touching frontend code — just update the database.

## Folder structure

```
portfolio/
├── frontend/          React + Vite + Tailwind (the site itself)
└── backend/           Express API + MySQL connection
    └── db/
        ├── schema.sql  Creates the database + all tables
        └── seed.js     Fills tables with your resume data
```

## 1. Set up MySQL

Make sure MySQL Server is installed and running locally (or use a cloud MySQL instance — PlanetScale, Railway, AWS RDS, etc.).

```bash
mysql -u root -p < backend/db/schema.sql
```

This creates the `portfolio_db` database and all tables (profile, education, experience, projects, skills, achievements, contact_messages).

## 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your real MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=portfolio_db
CORS_ORIGIN=http://localhost:5173
```

Seed the database with your resume content:
```bash
npm run seed
```

Start the API:
```bash
npm start
```
The API runs at `http://localhost:5000`. Test it: open `http://localhost:5000/api/health` — should return `{"status":"ok"}`.

## 3. Set up the frontend

In a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` — your portfolio is live, pulling data from MySQL through the API.

> The site also works without the backend running (it shows a small "offline data" badge and uses the same resume content baked in as a fallback), so it never looks broken — but connect the database to make it dynamically editable.

## 4. Editing content later

Because everything is in MySQL, you can update your site without redeploying frontend code:
- New project → `INSERT INTO projects ...` (+ `project_bullets`, `project_metrics`)
- New job/internship → `INSERT INTO experience ...` (+ `experience_bullets`)
- New skill → `INSERT INTO skills ...`
- Update bio/links → `UPDATE profile SET ...`

Or edit `backend/db/seed.js` directly and re-run `npm run seed`.

## 5. Reading messages people send you

Anyone who submits the contact form gets saved to the `contact_messages` table. Check them with:
```sql
SELECT * FROM contact_messages ORDER BY created_at DESC;
```
or hit `GET http://localhost:5000/api/contact` (this should be protected/removed before a public production deploy — see note below).

## 6. Deploying (when you're ready)

- **Frontend**: `npm run build` in `frontend/` → deploy the `dist/` folder to Vercel/Netlify.
- **Backend**: deploy `backend/` to Render/Railway/a VPS. Set the same `.env` vars there.
- **Database**: use a managed MySQL (PlanetScale, Railway MySQL, AWS RDS).
- Update `VITE_API_URL` in a `frontend/.env` file to point at your deployed backend URL, and `CORS_ORIGIN` in the backend `.env` to your deployed frontend URL.
- Before going public, add basic auth (or remove) the `GET /api/contact` route so strangers can't read your inbox.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MySQL (mysql2) |
| Design | Custom "engineering spec-sheet" visual identity — blueprint-style diagram of your dual-modal deepfake detection pipeline as the hero signature element |

Good luck with placements — the project data (deepfake detection metrics, Social Nexus Hub latency numbers) is pulled straight from your resume, so it's ready to link directly in applications.
