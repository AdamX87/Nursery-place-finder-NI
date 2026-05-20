// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Database schema (run in Supabase SQL editor to set up):
 *
 * CREATE TABLE nurseries (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   area TEXT,
 *   postcode TEXT,
 *   address TEXT,
 *   phone TEXT,
 *   email TEXT,
 *   website TEXT,
 *   type TEXT,
 *   session_type TEXT,
 *   sessions TEXT,
 *   age_min INTEGER,
 *   age_max INTEGER,
 *   spaces_available INTEGER DEFAULT 0,
 *   waitlist_open BOOLEAN DEFAULT false,
 *   next_intake TEXT,
 *   de_funded BOOLEAN DEFAULT false,
 *   rating NUMERIC(3,1),
 *   lat NUMERIC(10,6),
 *   lng NUMERIC(10,6),
 *   tags TEXT[],
 *   admissions_criteria JSONB,
 *   icon TEXT,
 *   color TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- Enable RLS
 * ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;
 *
 * -- Public read
 * CREATE POLICY "Public can read nurseries"
 *   ON nurseries FOR SELECT TO anon USING (true);
 *
 * -- Admin write (use service role key server-side only)
 * CREATE POLICY "Service role can write"
 *   ON nurseries FOR ALL TO service_role USING (true);
 *
 * -- Future: waiting_list table
 * CREATE TABLE waiting_list (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   nursery_id TEXT REFERENCES nurseries(id),
 *   parent_name TEXT,
 *   parent_email TEXT,
 *   child_dob DATE,
 *   postcode TEXT,
 *   notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- Future: vacancy_scrapes table
 * CREATE TABLE vacancy_scrapes (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   nursery_id TEXT REFERENCES nurseries(id),
 *   spaces_reported INTEGER,
 *   source_url TEXT,
 *   scraped_at TIMESTAMPTZ DEFAULT now()
 * );
 */
