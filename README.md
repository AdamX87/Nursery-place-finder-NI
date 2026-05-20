# 🌱 NurseryPlaceFinder

> Help parents in Northern Ireland find nursery places, understand admissions rules, and improve their chances.

A modern, mobile-first Next.js web app prototype — clean, fast, and built for stressed parents.

---

## ✨ Features

| Feature | Status |
|---|---|
| 🏠 Homepage with hero + search | ✅ Built |
| 🔍 Postcode + DOB search | ✅ Built |
| 📋 Results page with 20 nurseries | ✅ Built |
| 🎯 Admissions likelihood (High/Medium/Low) | ✅ Built |
| 🔎 Filter by type, likelihood, funding | ✅ Built |
| 📄 Nursery detail page | ✅ Built |
| 🗺️ Map placeholder (Google Maps ready) | ✅ Built |
| ✨ AI admissions explainer | ✅ Built |
| 💬 AI chat widget | ✅ Built |
| ⚙️ Admin dashboard | ✅ Built |
| 🗄️ Supabase schema | ✅ Built |
| 📱 Mobile-first responsive | ✅ Built |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Supabase account for live data

### 1. Clone & install

```bash
git clone https://github.com/your-org/nursery-place-finder.git
cd nursery-place-finder
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key        # optional for AI chat
```

> **MVP mode:** You don't need Supabase or Anthropic configured. The app runs entirely on mock data by default.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
nursery-place-finder/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (nav + AI widget)
│   ├── globals.css               # Tailwind + custom animations
│   ├── results/
│   │   └── page.tsx              # Search results page
│   ├── nursery/
│   │   └── [id]/
│   │       └── page.tsx          # Nursery detail page
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   └── api/
│       ├── nurseries/route.ts    # GET /api/nurseries
│       └── chat/route.ts         # POST /api/chat (AI helper)
│
├── components/
│   ├── ui/
│   │   ├── NurseryCard.tsx       # Reusable nursery listing card
│   │   ├── SearchForm.tsx        # Postcode + DOB search form
│   │   ├── LikelihoodBadge.tsx   # High/Medium/Low badge
│   │   ├── Badge.tsx             # Generic badge component
│   │   ├── Button.tsx            # Button with variants
│   │   └── AIChatWidget.tsx      # Floating AI chat assistant
│   └── layout/
│       └── Header.tsx            # Sticky navigation header
│
├── lib/
│   ├── mockData.ts               # 20 Belfast nurseries (mock)
│   ├── eligibility.ts            # Admissions likelihood logic
│   ├── supabase.ts               # Supabase client + schema docs
│   ├── store.ts                  # Zustand state management
│   └── utils.ts                  # cn(), colour helpers, formatters
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── supabase-schema.sql           # Full DB schema + seed data
├── .env.example                  # Environment variable template
├── tailwind.config.js            # Tailwind + brand colours
└── next.config.js                # Next.js config
```

---

## 🗄️ Database Setup (Supabase)

1. Create a new [Supabase](https://supabase.com) project
2. Go to **SQL Editor** and run `supabase-schema.sql`
3. This creates:
   - `nurseries` — main table with RLS
   - `waiting_list` — future waitlist feature
   - `vacancy_scrapes` — future automated vacancy tracking
   - `admissions_documents` — future PDF storage
   - `primary_schools` — future P1 admissions feature

4. To switch from mock data to Supabase, update `app/api/nurseries/route.ts`:

```ts
// Replace this:
let results = rankNurseries(MOCK_NURSERIES, dob, postcode)

// With this:
const { data } = await supabase
  .from('nurseries')
  .select('*')
  .order('rating', { ascending: false })
let results = rankNurseries(data ?? [], dob, postcode)
```

---

## 🤖 AI Features

### AI Admissions Explainer (Detail page)
Currently uses local FAQ matching. To connect to Claude:

```ts
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()
const response = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 512,
  system: `You are a friendly expert on Northern Ireland nursery admissions.
    Explain things clearly for parents. Keep answers short and practical.
    Focus on NI-specific rules: DE funded places, catchment areas, 
    underage applications, and the EA application process.`,
  messages: [{ role: 'user', content: message }],
})
```

### AI Chat Widget
The `AIChatWidget` component uses the `/api/chat` endpoint. Swap the local `getBotResponse()` for a real API call to enable full Claude-powered answers.

---

## 🎨 Design System

Brand colours are defined in `tailwind.config.js`:

```js
brand: {
  50:  '#f0fdf4',   // backgrounds
  500: '#4CAF82',   // primary green
  600: '#2E8B5C',   // buttons
  700: '#1a6644',   // hover states
  800: '#1a3a2a',   // hero/dark sections
}
```

---

## 🗺️ Roadmap

### Phase 2 – Real Data
- [ ] Live vacancy scraping from EA website
- [ ] Real postcode → distance via `postcodes.io` API
- [ ] Google Maps embed on detail page
- [ ] Supabase real-time vacancy updates

### Phase 3 – Smart Features
- [ ] Automated PDF admissions criteria parsing (Claude)
- [ ] Waitlist registration form
- [ ] Parent accounts & saved nurseries
- [ ] Email alerts when spaces become available

### Phase 4 – Primary Schools
- [ ] P1 admissions module
- [ ] Transfer test (11+) info
- [ ] School comparison tool

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| State | Zustand |
| AI | Anthropic Claude API |
| Icons | Lucide React |
| Language | TypeScript |
| Deploy | Vercel (recommended) |

---

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard → Settings → Environment Variables.

---

## 📝 Notes

- This is an **MVP prototype** — not production-ready
- All data is mock/sample data representing Belfast nurseries
- Admissions likelihood scores are estimated, not official EA data
- Always direct parents to official EA resources: [eani.org.uk](https://eani.org.uk)

---

## 📄 License

MIT — free to use and adapt.
