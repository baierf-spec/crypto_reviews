-- Migration: Add unique constraint on coin_id in analyses table
-- Run this in your Supabase SQL Editor to fix the upsert functionality

-- First, check if there are any duplicate coin_ids
SELECT coin_id, COUNT(*) as count
FROM analyses
GROUP BY coin_id
HAVING COUNT(*) > 1;

-- If there are duplicates, you may want to clean them up first
-- For example, keep only the most recent analysis for each coin_id:
-- DELETE FROM analyses WHERE id NOT IN (
--   SELECT DISTINCT ON (coin_id) id 
--   FROM analyses 
--   ORDER BY coin_id, date DESC
-- );

-- Add unique constraint
ALTER TABLE analyses ADD CONSTRAINT analyses_coin_id_unique UNIQUE (coin_id);

-- Verify the constraint was added
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'analyses' AND constraint_name = 'analyses_coin_id_unique';
