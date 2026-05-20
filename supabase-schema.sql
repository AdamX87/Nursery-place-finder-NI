-- ============================================================
-- NurseryPlaceFinder – Supabase Database Schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;  -- for geo queries (optional)


-- ─── NURSERIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nurseries (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  area              TEXT,
  postcode          TEXT,
  address           TEXT,
  phone             TEXT,
  email             TEXT,
  website           TEXT,

  -- Type: state | catholic | integrated | private | montessori | waldorf
  type              TEXT NOT NULL DEFAULT 'state',

  -- Sessions
  session_type      TEXT NOT NULL DEFAULT 'part-time',  -- 'full-time' | 'part-time'
  sessions          TEXT,                               -- human-readable description

  -- Age eligibility
  age_min           INTEGER NOT NULL DEFAULT 3,
  age_max           INTEGER NOT NULL DEFAULT 4,

  -- Availability
  spaces_available  INTEGER NOT NULL DEFAULT 0,
  waitlist_open     BOOLEAN NOT NULL DEFAULT false,
  next_intake       TEXT,

  -- Funding
  de_funded         BOOLEAN NOT NULL DEFAULT false,

  -- Rating (1.0 – 5.0)
  rating            NUMERIC(3,1),

  -- Location (for future distance queries)
  lat               NUMERIC(10,6),
  lng               NUMERIC(10,6),

  -- Admissions criteria stored as JSONB array:
  -- [{ priority: 1, title: "...", description: "..." }, ...]
  admissions_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Tags array e.g. ["Sibling priority", "Within catchment"]
  tags              TEXT[] NOT NULL DEFAULT '{}',

  -- Display
  icon              TEXT DEFAULT '🏫',
  color             TEXT DEFAULT '#F0FDF4',

  -- Timestamps
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nurseries_updated_at
  BEFORE UPDATE ON nurseries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index on postcode prefix for fast catchment queries
CREATE INDEX idx_nurseries_postcode ON nurseries USING btree (postcode);
CREATE INDEX idx_nurseries_type ON nurseries (type);
CREATE INDEX idx_nurseries_de_funded ON nurseries (de_funded);
CREATE INDEX idx_nurseries_spaces ON nurseries (spaces_available);

-- Row-Level Security
ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read nurseries"
  ON nurseries FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can do everything"
  ON nurseries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ─── WAITING LIST ─────────────────────────────────────────────
-- Future: parents can join a waitlist for a full nursery
CREATE TABLE IF NOT EXISTS waiting_list (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nursery_id      TEXT NOT NULL REFERENCES nurseries(id) ON DELETE CASCADE,
  parent_name     TEXT NOT NULL,
  parent_email    TEXT NOT NULL,
  parent_phone    TEXT,
  child_dob       DATE NOT NULL,
  child_name      TEXT,
  postcode        TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending | offered | accepted | declined
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waiting_list FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role reads waitlist"
  ON waiting_list FOR SELECT
  TO service_role
  USING (true);


-- ─── VACANCY SCRAPES ──────────────────────────────────────────
-- Future: automated scraping records vacancy data over time
CREATE TABLE IF NOT EXISTS vacancy_scrapes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nursery_id       TEXT NOT NULL REFERENCES nurseries(id) ON DELETE CASCADE,
  spaces_reported  INTEGER,
  source_url       TEXT,
  source_type      TEXT DEFAULT 'manual',  -- manual | scraper | api
  raw_data         JSONB,
  scraped_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scrapes_nursery_id ON vacancy_scrapes (nursery_id);
CREATE INDEX idx_scrapes_scraped_at ON vacancy_scrapes (scraped_at DESC);

ALTER TABLE vacancy_scrapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages scrapes"
  ON vacancy_scrapes FOR ALL
  TO service_role
  USING (true);


-- ─── ADMISSIONS DOCUMENTS ────────────────────────────────────
-- Future: store links to downloaded/parsed admissions PDFs
CREATE TABLE IF NOT EXISTS admissions_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nursery_id      TEXT NOT NULL REFERENCES nurseries(id) ON DELETE CASCADE,
  academic_year   TEXT,           -- e.g. "2025-26"
  file_url        TEXT,           -- Supabase Storage URL
  file_name       TEXT,
  parsed_criteria JSONB,          -- AI-parsed criteria from PDF
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admissions_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read documents"
  ON admissions_documents FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─── PRIMARY SCHOOLS (Future scalability) ────────────────────
-- Nursery → Primary school link for future P1 admissions feature
CREATE TABLE IF NOT EXISTS primary_schools (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  area            TEXT,
  postcode        TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  type            TEXT,
  lat             NUMERIC(10,6),
  lng             NUMERIC(10,6),
  linked_nursery_id TEXT REFERENCES nurseries(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE primary_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read primary schools"
  ON primary_schools FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─── SEED: Insert all 20 mock nurseries ─────────────────────
-- Run this after creating the tables to populate with initial data

INSERT INTO nurseries (id, name, area, postcode, address, phone, email, type, session_type, sessions, age_min, age_max, spaces_available, waitlist_open, next_intake, de_funded, rating, lat, lng, tags, admissions_criteria, icon, color) VALUES

('npf-001','Sunflower Nursery School','Andersonstown','BT11 8AJ','14 Andersonstown Road, Belfast BT11 8AJ','028 9062 1234','info@sunflower-nursery.co.uk','state','part-time','Morning (9:00am–12:00pm) & Afternoon (12:30pm–3:30pm)',3,4,3,false,'September 2025',true,4.8,54.5793,-6.0021,
ARRAY['Sibling priority','Within catchment','State controlled'],
'[{"priority":1,"title":"Children with a statement of special educational needs","description":"Children who have a statutory statement of SEN that names this school as appropriate placement."},{"priority":2,"title":"Siblings of current pupils","description":"Children who have a brother or sister currently enrolled in Years 1–7 of the primary school attached to this nursery."},{"priority":3,"title":"Children within the catchment area","description":"Children whose home address falls within the defined catchment boundary for this school."},{"priority":4,"title":"All other children","description":"All remaining applicants, ranked by distance from home address to school gate."}]'::jsonb,
'🌻','#FEF3C7'),

('npf-002','Little Explorers Pre-School','Lisburn Road','BT9 7GT','88 Lisburn Road, Belfast BT9 7GT','028 9066 5678','hello@littleexplorers.co.uk','integrated','full-time','Full Day (8:00am–6:00pm)',2,4,6,false,'September 2025',true,4.9,54.5733,-5.9597,
ARRAY['Integrated school','Open enrolment','Extended hours'],
'[{"priority":1,"title":"Children who meet funded hours criteria","description":"Children aged 3–4 who are eligible for the DE funded pre-school programme."},{"priority":2,"title":"Siblings of current pupils","description":"Brothers or sisters of children currently enrolled across any year group."},{"priority":3,"title":"Children of staff members","description":"Children whose parent or guardian is a permanent member of staff."},{"priority":4,"title":"All other applicants","description":"Allocated by date of application receipt, earliest first."}]'::jsonb,
'🔭','#EFF6FF'),

('npf-003','Rainbow Garden Nursery','Newtownabbey','BT37 0BJ','3 Rathcoole Drive, Newtownabbey BT37 0BJ','028 9085 9012','admin@rainbow-garden.co.uk','private','part-time','Morning only (9:00am–12:00pm)',3,4,0,true,'January 2026',true,4.5,54.6641,-5.9531,
ARRAY['Oversubscribed','Waitlist open','Popular school'],
'[{"priority":1,"title":"Statutory SEN placement","description":"Children with a statement of special educational needs naming this nursery."},{"priority":2,"title":"Siblings attending the primary school","description":"Children with a sibling currently in Primary 1–7 of the linked primary school."},{"priority":3,"title":"Catchment area residents","description":"Children living within 1.5 miles of the school."},{"priority":4,"title":"Remaining applicants","description":"Distance from home to school (nearest first)."}]'::jsonb,
'🌈','#F5F3FF'),

('npf-015','Growing Minds Nursery','Malone','BT9 6RR','72 Malone Road, Belfast BT9 6RR','028 9068 1122','hello@growingminds.co.uk','waldorf','full-time','Full Day (8:00am–6:00pm)',2,5,11,false,'Ongoing enrolment',false,4.9,54.5621,-5.9452,
ARRAY['Waldorf approach','Private provider','Nature-based','No screen time'],
'[{"priority":1,"title":"Open admissions","description":"All children aged 2–5 welcome. No geographical restrictions."},{"priority":2,"title":"Application date","description":"Places offered in order of application. Rolling admissions throughout the year."},{"priority":3,"title":"Sibling priority","description":"Siblings of currently enrolled children are given waitlist priority if the nursery is full."}]'::jsonb,
'🧠','#F5F3FF')

ON CONFLICT (id) DO NOTHING;

-- Note: Add remaining nurseries similarly, or import via Supabase dashboard CSV import.
-- The full dataset is in /lib/mockData.ts – use that as the source of truth.


-- ─── USEFUL QUERIES ──────────────────────────────────────────

-- Get all nurseries with spaces, ordered by availability
-- SELECT * FROM nurseries WHERE spaces_available > 0 ORDER BY spaces_available DESC;

-- Get DE-funded nurseries only
-- SELECT * FROM nurseries WHERE de_funded = true ORDER BY rating DESC;

-- Postcode prefix search (mock distance)
-- SELECT * FROM nurseries WHERE postcode LIKE 'BT7%' OR postcode LIKE 'BT9%';

-- Vacancy trend for a nursery
-- SELECT nursery_id, spaces_reported, scraped_at
-- FROM vacancy_scrapes
-- WHERE nursery_id = 'npf-001'
-- ORDER BY scraped_at DESC
-- LIMIT 30;
