# Database Migration Guide

This document describes how to manage database migrations for the Stavky application.

## Overview

The application uses Supabase (PostgreSQL) with migrations stored in `supabase/migrations/`. Migrations are automatically applied to production via GitHub Actions when pushed to the `main` branch.

## Migration Workflow

### Local Development

1. **Create a new migration file:**
   ```bash
   # Create migration file in supabase/migrations/
   # Format: YYYYMMDD_description.sql
   # Example: 20250121_fix_functions_after_column_removal.sql
   ```

2. **Test migration locally:**
   ```bash
   # Apply migration to local database
   supabase migration up --include-all
   
   # Or reset database and apply all migrations
   supabase db reset
   ```

3. **Verify migration:**
   - Check that functions/tables are created correctly
   - Test affected queries and functions
   - Verify application still works as expected

### Production Deployment

#### Option 1: Automatic via GitHub Actions (Recommended)

The GitHub Actions workflow (`.github/workflows/supabase-migration.yml`) automatically runs migrations when:

1. **Push migration to main branch:**
   ```bash
   git add supabase/migrations/YYYYMMDD_description.sql
   git commit -m "Add migration: description"
   git push origin main
   ```

2. **Workflow triggers automatically:**
   - Detects changes in `supabase/migrations/**`
   - Links to production Supabase project
   - Runs `supabase db push` to apply all pending migrations
   - View progress in GitHub Actions tab

3. **Verify deployment:**
   - Check GitHub Actions workflow logs
   - Verify migration was applied in Supabase Dashboard → Database → Migrations
   - Test affected features in production

#### Option 2: Manual via Supabase CLI

If you need to deploy manually or the GitHub Actions workflow fails:

```bash
# Link to production project (if not already linked)
supabase link --project-ref ezhcfemzrbfsfkafqsav

# Push migrations to production
supabase db push
```

**Required environment variables:**
- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_DB_PASSWORD` - Database password

## Recent Migrations

### 2025-01-21: Fix Functions After Column Removal

**Migration:** `20250121_fix_functions_after_column_removal.sql`

**Problem:**
After removing `match_date`, `match`, `betting_company_id`, and `sport_id` columns from `betting_tips` table (migration `20250120_remove_betting_tips_columns.sql`), three database functions were broken:

1. `tip_monthly_summary` - Used by statistics page
2. `tip_success_rate` - Used for monthly success rate calculations
3. `apply_free_month_from_loss` - Trigger function for free month logic

**Solution:**
Updated all three functions to:
- Get `match_date` from `betting_tip_items` table instead of `betting_tips`
- Use the earliest `match_date` from items for each tip (for monthly grouping)
- Fallback to `created_at` if no items exist

**Impact:**
- Statistics page now displays correct win/loss counts
- Monthly summaries work correctly
- Free month logic continues to function properly

**Deployment:**
- Applied locally: ✅
- Production: Deploy via GitHub Actions or manual CLI

### 2025-01-20: Remove Columns from betting_tips

**Migration:** `20250120_remove_betting_tips_columns.sql`

**Changes:**
- Removed `betting_company_id`, `sport_id`, `match`, and `match_date` columns from `betting_tips` table
- These columns are now stored in `betting_tip_items` table
- `betting_tips` now only contains: `id`, `description`, `odds`, `stake`, `total_win`, `status`, `created_by`, `created_at`, `updated_at`

**Note:** This migration required a follow-up migration (`20250121_fix_functions_after_column_removal.sql`) to fix dependent functions.

## Migration Best Practices

1. **Always test locally first:**
   - Run `supabase db reset` to test from scratch
   - Verify all affected queries and functions work
   - Test with sample data

2. **Check for dependent code:**
   - Search codebase for references to removed columns
   - Update application code before/with migration
   - Check database functions, triggers, and views

3. **Migration naming:**
   - Format: `YYYYMMDD_descriptive_name.sql`
   - Use descriptive names that explain what the migration does
   - Example: `20250121_fix_functions_after_column_removal.sql`

4. **Document breaking changes:**
   - Add comments in migration file explaining the change
   - Update this document with migration details
   - Note any required follow-up migrations

5. **Rollback considerations:**
   - Supabase migrations are forward-only
   - Plan migrations carefully to avoid needing rollbacks
   - Test thoroughly before deploying to production

## Troubleshooting

### Migration fails in GitHub Actions

1. **Check workflow logs:**
   - Go to GitHub → Actions → Latest workflow run
   - Review error messages in logs

2. **Common issues:**
   - Missing environment variables (SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD)
   - Incorrect project reference
   - Syntax errors in migration SQL
   - Conflicts with existing schema

3. **Manual deployment:**
   - Use Option 2 (Manual via Supabase CLI) to deploy
   - Fix issues and push again

### Migration applied but functions still broken

1. **Verify migration was applied:**
   - Check Supabase Dashboard → Database → Migrations
   - Confirm migration appears in list

2. **Check function definitions:**
   - Run migration SQL manually in Supabase SQL Editor
   - Verify functions are updated correctly

3. **Clear cache:**
   - Restart application if needed
   - Clear browser cache for frontend changes

## Related Documentation

- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Complete database schema documentation
- [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md) - Common Supabase issues
- [PRODUCTION_SEEDING.md](./PRODUCTION_SEEDING.md) - Production database seeding guide
- [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) - GitHub Actions configuration

## Quick Reference

```bash
# Local development
supabase start                    # Start local Supabase
supabase db reset                 # Reset and apply all migrations
supabase migration up             # Apply pending migrations
supabase status                   # Check Supabase status

# Production
supabase link --project-ref <ref> # Link to production project
supabase db push                  # Push migrations to production
```




