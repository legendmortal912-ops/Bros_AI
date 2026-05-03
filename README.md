# Bros_AI — Autonomous AI Agent Platform

A full-stack production-ready AI agent platform. Give it a natural language instruction and it autonomously executes tasks using Gmail, Google Calendar, and web search.

## Project Structure

```
BrosAI/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/         # Landing, Auth, Dashboard, History, Integrations, Settings
│   │   ├── components/    # DashboardLayout, UI components
│   │   ├── hooks/         # useAuth
│   │   └── lib/           # supabase.ts, api.ts
│   └── .env.example
├── backend/           # Python FastAPI + LangGraph
│   ├── app/
│   │   ├── main.py        # FastAPI app entry
│   │   ├── config.py      # Settings from .env
│   │   ├── auth.py        # Supabase JWT verification
│   │   ├── db.py          # Supabase client
│   │   ├── agents/        # LangGraph agent
│   │   ├── tools/         # Gmail, Calendar, Search
│   │   └── api/           # Tasks, Integrations routers
│   └── .env.example
└── supabase_schema.sql
```

## Setup

### 1. Supabase
1. Create a project at supabase.com
2. Go to SQL Editor → paste and run `supabase_schema.sql`
3. Go to Settings → API → copy your keys
4. Go to Authentication → Providers → enable Google

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your keys in .env
npm install
npm run dev
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### 3. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your keys in .env
uvicorn app.main:app --reload --port 8000
```

**backend/.env:**
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
TAVILY_API_KEY=tvly-...
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/integrations/google/callback
FRONTEND_URL=http://localhost:5173
```

## API Keys You Need

| Key | Where to get it | Cost |
|-----|----------------|------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | Pay per use |
| `SUPABASE_URL` + keys | supabase.com/dashboard → Settings → API | Free tier |
| `TAVILY_API_KEY` | app.tavily.com | 1000 free/month |
| `GOOGLE_CLIENT_ID/SECRET` | console.cloud.google.com → Credentials | Free |

## Google OAuth Setup

1. Go to console.cloud.google.com
2. Create project "Bros_AI"
3. Enable Gmail API + Google Calendar API
4. Create OAuth 2.0 Client ID (Web application)
5. Add redirect URI: `http://localhost:8000/api/integrations/google/callback`
6. Copy Client ID and Secret to backend/.env

## Demo Flow

Once running, try this instruction on the Dashboard:

> "Prepare my client meeting — check Gmail for emails from them, draft a reply, and book a 30-minute slot on my calendar for tomorrow at 2pm"

The agent will:
1. 🧠 Plan the task
2. 📬 Read Gmail inbox
3. ✍️ Draft a reply
4. 📤 Send the email
5. 📅 Check calendar availability
6. 📅 Create the event
7. ✅ Report what was done

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub → connect to Vercel → set env vars
```

### Backend → Railway
```bash
# Push to GitHub → connect to Railway
# Set all env vars in Railway dashboard
# Railway auto-detects Python and runs uvicorn
```

Add a `Procfile` in backend/:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
