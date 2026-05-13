# SkillCircle Micro-Partner CRM

An enterprise-level SaaS CRM dashboard built with Next.js, Express, and Supabase.

## Architecture

- **Frontend:** Next.js 14 (App Router), TailwindCSS, Recharts.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL (Supabase).
- **Security:** JWT Auth, Row Level Security (RLS), Role-Based Access Control (RBAC).

## Getting Started

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** and execute the migrations in order:
   - `supabase/migrations/20240512000000_create_partners_and_leads.sql`
   - `supabase/migrations/20240512000001_add_wallets_and_payouts.sql`

### 2. Environment Variables

**Backend (`/backend/.env`):**
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Frontend (`/frontend/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Locally

From the root directory:
```bash
npm install
npm start
```

This will start both the frontend (localhost:3000) and the backend (localhost:5000).

## Features
- **Dashboard:** KPI cards, wallet management, and conversion analytics.
- **Leads:** Full CRUD, bulk CSV/Excel import, status tracking.
- **Partners:** Partner directory and performance tracking.
- **Finance:** Wallet balance, payout history, and leaderboard.
- **Security:** Secure login/signup and role-based permissions.
