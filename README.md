# ClinicDesk — Smart Appointment & Lead Management

A minimal, fully functional clinic appointment booking and patient lead management system built with React (Vite) + Tailwind CSS on the frontend and Node.js + Express on the backend, with Supabase (PostgreSQL) as the database.

---

## Project Structure

```
project-root/
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx    # Landing page with hero + CTA
│   │   │   ├── Book.jsx    # Appointment booking form
│   │   │   └── Admin.jsx   # Admin dashboard (route: /admin)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── index.html          # GA4 snippet lives here
│   └── vite.config.js
├── backend/                # Node.js + Express
│   ├── server.js
│   └── routes/
│       └── appointments.js
└── supabase/
    └── schema.sql          # Run this in your Supabase SQL editor
```

---

## Pages

| Route     | Page             | Description                              |
|-----------|------------------|------------------------------------------|
| `/`       | Home             | Hero, services, how-it-works, CTA        |
| `/book`   | Book Appointment | Form — submits to Supabase via backend   |
| `/admin`  | Admin Dashboard  | View, filter, update, delete, export CSV |

---

## Step-by-Step Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the contents of `supabase/schema.sql`.
3. Copy your **Project URL** and **anon/public API key** from Settings > API.

### 2. Backend (local dev)

```bash
cd backend
npm install
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_ANON_KEY in .env
npm run dev        # runs on http://localhost:4000
```

**API Endpoints:**

| Method | Endpoint                         | Purpose                  |
|--------|----------------------------------|--------------------------|
| POST   | `/api/appointments`              | Create appointment/lead  |
| GET    | `/api/appointments`              | List all (filter by ?status=) |
| PUT    | `/api/appointments/:id`          | Update status            |
| DELETE | `/api/appointments/:id`          | Delete appointment       |
| GET    | `/api/appointments/export`       | Download CSV             |

### 3. Frontend (local dev)

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000
npm run dev        # runs on http://localhost:5173
```

---

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → New Web Service.
3. Connect your repo, set root directory to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your anon key
   - `FRONTEND_URL` = your Vercel frontend URL (e.g. `https://clinicdesk.vercel.app`)
7. Copy the Render service URL (e.g. `https://clinicdesk-api.onrender.com`).

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
2. Set root directory to `frontend`.
3. Framework preset: **Vite**.
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy.

### Final Steps

- In `frontend/index.html`, replace `G-XXXXXXXXXX` with your real **GA4 Measurement ID**.
- Update `https://clinicdesk.vercel.app` in `sitemap.xml` and `robots.txt` with your real domain.
- In `backend/.env`, set `FRONTEND_URL` to your Vercel URL.

---

## Features

- Appointment booking form with full validation
- Automatic lead tracking (every booking = a lead)
- Admin dashboard at `/admin` with:
  - Live stats (Total / Pending / Completed / No-show)
  - Filter by status
  - Inline status update dropdown
  - Search by name/email/phone
  - Delete with confirmation
  - CSV export button
- Google Analytics 4 page view + booking event tracking
- SEO: page titles, meta description, robots.txt, sitemap.xml
- Fully responsive (mobile + desktop)

---

## Environment Variables

### Backend (`backend/.env`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=4000
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://your-render-url.onrender.com
```
