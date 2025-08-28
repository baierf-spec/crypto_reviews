-- Crypto AI Insights Database Schema
-- Run this in your Supabase SQL Editor

-- Coins queue table
CREATE TABLE coins_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coin_id TEXT NOT NULL UNIQUE,
  last_analyzed_date TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coin_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ratings JSONB NOT NULL,
  price_prediction JSONB,
  on_chain_data JSONB,
  social_sentiment JSONB,
  seo_title TEXT,
  content_format TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User votes table
CREATE TABLE user_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coin_id TEXT NOT NULL,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES analyses(id),
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analyses_coin_id ON analyses(coin_id);
CREATE INDEX idx_analyses_date ON analyses(date);
CREATE INDEX idx_coins_queue_coin_id ON coins_queue(coin_id);
CREATE INDEX idx_user_votes_coin_id ON user_votes(coin_id);
CREATE INDEX idx_comments_analysis_id ON comments(analysis_id);

-- Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coins_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to analyses" ON analyses
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to coins_queue" ON coins_queue
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to user_votes" ON user_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to comments" ON comments
  FOR SELECT USING (true);

-- Create policies for authenticated write access (for future use)
CREATE POLICY "Allow authenticated insert to analyses" ON analyses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to user_votes" ON user_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to comments" ON comments
  FOR INSERT WITH CHECK (true);
