# Production Database Seeding Guide

## Problem

Sports and leagues dropdowns are not working in production because the seed data hasn't been inserted into the production database.

## Solution Options

### Option 1: Automatic Migration (Recommended)

The migration `20251209_ensure_seed_data.sql` will automatically run when:
- GitHub Actions workflow runs migrations (via `supabase db push`)
- You manually run migrations using Supabase CLI

**To trigger via GitHub Actions:**
1. Push the migration file to the `main` branch
2. The workflow will automatically run migrations
3. Verify the data exists by checking the logs

**To trigger manually via Supabase CLI:**
```bash
supabase db push --project-ref YOUR_PROJECT_REF
```

### Option 2: Manual Seeding via Supabase Dashboard

If migrations aren't running automatically, you can manually seed the database:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your production project

2. **Open SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New query**

3. **Run the Seed Script**
   - Open `scripts/seed-production.sql` from this repository
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

4. **Verify the Data**
   - After running, execute these verification queries:
   ```sql
   SELECT COUNT(*) as companies_count FROM public.betting_companies;
   SELECT COUNT(*) as sports_count FROM public.sports;
   SELECT COUNT(*) as leagues_count FROM public.leagues;
   ```
   - Expected results:
     - `companies_count`: 4 (Bet365, Tipsport, Fortuna, Nike)
     - `sports_count`: 5 (Soccer, Tennis, Basketball, Ice Hockey, Volleyball)
     - `leagues_count`: 10 (4 soccer + 2 basketball + 2 hockey + 2 tennis)

5. **Check Sports and Leagues Relationship**
   ```sql
   SELECT s.name as sport, COUNT(l.id) as leagues_count 
   FROM public.sports s 
   LEFT JOIN public.leagues l ON s.id = l.sport_id 
   GROUP BY s.id, s.name 
   ORDER BY s.name;
   ```
   - This should show each sport with its associated leagues

## Troubleshooting

### Issue: Script runs but no data appears

**Possible causes:**
1. RLS policies blocking the insert
   - Solution: The seed script should run with service role or as a migration (bypasses RLS)
   - If running manually, ensure you're using the service role key or running as a migration

2. Data already exists but with different casing
   - Solution: The script uses `LOWER()` comparison, so it should handle this
   - Check if data exists: `SELECT * FROM public.sports;`

3. Transaction rolled back
   - Solution: Ensure the entire script runs in one transaction
   - Check for any errors in the SQL Editor output

### Issue: Leagues not appearing for sports

**Possible causes:**
1. Sports weren't inserted first
   - Solution: The script inserts sports before leagues, but if sports insertion failed, leagues will fail too
   - Verify sports exist: `SELECT * FROM public.sports;`

2. Foreign key constraint issues
   - Solution: Ensure sports are inserted before leagues
   - The script handles this with the DO block that checks for sport IDs

### Issue: Migration not running in GitHub Actions

**Check:**
1. Verify secrets are configured:
   - `SUPABASE_PROJECT_ID`
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_DB_PASSWORD`

2. Check GitHub Actions logs for migration errors

3. Verify the migration file is in `supabase/migrations/` directory

## Verification Checklist

After seeding, verify:
- [ ] Betting companies dropdown works on `/newbet` page
- [ ] Sports dropdown works on `/newbet` page
- [ ] Leagues dropdown populates when a sport is selected
- [ ] Data appears in Supabase Dashboard → Table Editor
- [ ] No errors in browser console when loading `/newbet` page

## Data Structure

### Betting Companies
- Bet365
- Tipsport
- Fortuna
- Nike

### Sports and Leagues
- **Soccer**: Premier League, La Liga, Champions League, Serie A
- **Basketball**: NBA, EuroLeague
- **Ice Hockey**: NHL, KHL
- **Tennis**: ATP, WTA
- **Volleyball**: (no leagues defined)

## Notes

- The seed script is **idempotent** - it's safe to run multiple times
- It uses `WHERE NOT EXISTS` checks to prevent duplicates
- The migration version (`20251209_ensure_seed_data.sql`) will run automatically in future deployments






