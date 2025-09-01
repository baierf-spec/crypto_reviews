# Fix Database Issues - Reviews Not Saving

## Problem
Generated reviews are disappearing because they're not being saved to the database properly. The issue is that the `analyses` table is missing a unique constraint on `coin_id`, which prevents the upsert functionality from working.

## Solution

### Step 1: Run Database Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/bycppjugjhyvhfxlgxej
2. Navigate to **SQL Editor**
3. Run the following SQL commands:

```sql
-- Check for duplicate coin_ids first
SELECT coin_id, COUNT(*) as count
FROM analyses
GROUP BY coin_id
HAVING COUNT(*) > 1;

-- If there are duplicates, clean them up (keep only the most recent)
DELETE FROM analyses WHERE id NOT IN (
  SELECT DISTINCT ON (coin_id) id 
  FROM analyses 
  ORDER BY coin_id, date DESC
);

-- Add unique constraint
ALTER TABLE analyses ADD CONSTRAINT analyses_coin_id_unique UNIQUE (coin_id);

-- Verify the constraint was added
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'analyses' AND constraint_name = 'analyses_coin_id_unique';
```

### Step 2: Test the Fix

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the database save functionality:
   - Visit: `http://localhost:3000/api/debug/test-save`
   - You should see a success message

3. Generate a new review:
   - Go to any coin page
   - Click "Request fresh review"
   - The review should now be saved to the database

### Step 3: Verify Reviews Persist

1. Generate a review for a coin
2. Refresh the page
3. The review should still be there
4. Restart the development server
5. The review should still be there (loaded from database)

## What Was Fixed

1. **Unique Constraint**: Added `UNIQUE` constraint on `coin_id` in the `analyses` table
2. **Better Error Handling**: Improved logging in the `saveAnalysis` function
3. **Fallback Mechanism**: Enhanced delete+insert fallback when upsert fails
4. **Test Endpoint**: Added `/api/debug/test-save` to verify database functionality

## Troubleshooting

If you still have issues:

1. **Check Supabase Logs**: Go to Supabase dashboard → Logs to see any database errors
2. **Test Connection**: Run `node test-supabase-simple.js` to verify connection
3. **Check Environment**: Ensure `.env.local` has correct Supabase credentials
4. **Verify RLS Policies**: Make sure Row Level Security policies allow writes

## Expected Behavior After Fix

- ✅ Reviews are saved to database immediately
- ✅ Reviews persist after page refresh
- ✅ Reviews persist after server restart
- ✅ Reviews can be updated (upsert functionality)
- ✅ Memory storage serves as backup if database fails


