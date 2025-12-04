# Database Schema Documentation

This document describes the complete database schema for the Stavky sports betting tips application.

## Overview

The database uses PostgreSQL via Supabase with the following key features:
- Row Level Security (RLS) for data access control
- Custom functions for business logic
- Triggers for automated operations
- Enum types for constrained values

## Schema Diagram

```
auth.users (Supabase)
    ↓
public.users
    ├──→ public.betting_tips (created_by)
    └──→ public.user_subscriptions (user_id)

public.betting_companies
    └──→ public.betting_tips (betting_company_id)

public.sports
    ├──→ public.leagues (sport_id)
    └──→ public.betting_tips (sport_id)

public.leagues
    └──→ public.betting_tips (league_id)

public.marketing_settings (standalone)
```

## Tables

### `public.users`

Extends Supabase's `auth.users` table with application-specific user data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, REFERENCES `auth.users(id)` ON DELETE CASCADE | User ID (matches auth.users) |
| `email` | `text` | NOT NULL, UNIQUE | User email address |
| `role` | `user_role` | NOT NULL, DEFAULT 'customer' | User role: 'betting' or 'customer' |
| `account_active_until` | `timestamptz` | NULLABLE | Account expiration timestamp |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Last update timestamp (auto-updated) |

**Indexes:**
- Primary key on `id`

**Triggers:**
- `set_users_updated_at`: Automatically updates `updated_at` on row updates

**RLS Policies:**
- Users can view their own profile
- Betting role can view and manage all users
- Customers can only view their own data

### `public.betting_companies`

Reference table for betting companies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL, UNIQUE | Company name |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Creation timestamp |

**RLS Policies:**
- Public read access (for dropdowns)
- Betting role can manage (create, update, delete)

### `public.sports`

Reference table for sports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL | Sport name (case-insensitive unique) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Unique index on `lower(name)` for case-insensitive uniqueness

**RLS Policies:**
- Public read access
- Betting role can manage

### `public.leagues`

Reference table for leagues, linked to sports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL | League name |
| `sport_id` | `uuid` | NOT NULL, REFERENCES `sports(id)` ON DELETE CASCADE | Parent sport |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Index on `sport_id` for filtering
- Unique constraint on `(sport_id, name)` - same league name can exist for different sports

**RLS Policies:**
- Public read access
- Betting role can manage

### `public.betting_tips`

Core table storing betting tips.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `betting_company_id` | `uuid` | NOT NULL, REFERENCES `betting_companies(id)` ON DELETE RESTRICT | Betting company |
| `sport_id` | `uuid` | NOT NULL, REFERENCES `sports(id)` ON DELETE RESTRICT | Sport |
| `league_id` | `uuid` | NOT NULL, REFERENCES `leagues(id)` ON DELETE RESTRICT | League |
| `match` | `text` | NOT NULL | Match description |
| `odds` | `numeric(5,3)` | NOT NULL, CHECK (1.001 <= odds <= 2.0) | Betting odds (1.001 to 2.00) |
| `match_date` | `timestamptz` | NOT NULL | Match date and time |
| `status` | `tip_status` | NOT NULL, DEFAULT 'pending' | Tip status: 'pending', 'win', or 'loss' |
| `created_by` | `uuid` | NULLABLE, REFERENCES `users(id)` ON DELETE SET NULL | Creator user ID |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Index on `betting_company_id`
- Index on `sport_id`
- Index on `league_id`
- Index on `status`

**Triggers:**
- `set_betting_tips_updated_at`: Auto-updates `updated_at`
- `trg_betting_tips_loss_free_month`: Sets `next_month_free` flag when tip status changes to 'loss'

**RLS Policies:**
- Betting role: Full access (create, read, update, delete)
- Active customers: Read access to pending tips only
- Public (anonymous): Read access to pending tips for homepage preview

### `public.user_subscriptions`

Tracks user subscription months and free month eligibility.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `user_id` | `uuid` | NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE | User ID |
| `month` | `date` | NOT NULL | Subscription month (first day of month) |
| `valid_to` | `timestamptz` | NULLABLE | Subscription expiration timestamp |
| `next_month_free` | `boolean` | NOT NULL, DEFAULT false | Flag indicating free month eligibility |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Index on `(user_id, month)` for efficient lookups
- Unique constraint on `(user_id, month)` - one subscription per user per month

**Triggers:**
- `trg_user_subscriptions_free_month`: Extends user account when `next_month_free` is set to true

**RLS Policies:**
- Betting role: Full access
- Customers: Read access to own subscriptions only

### `public.marketing_settings`

Key-value store for marketing and business logic configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `key` | `text` | NOT NULL, UNIQUE | Setting key |
| `value` | `jsonb` | NOT NULL, DEFAULT '{}' | Setting value (JSON) |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Triggers:**
- `set_marketing_settings_updated_at`: Auto-updates `updated_at`

**RLS Policies:**
- Betting role: Full access
- Public/authenticated: Read access for homepage display

**Common Keys:**
- `free_month_rules`: Configuration for automatic free month logic
  ```json
  {
    "autoFreeMonth": true,
    "lossThreshold": 1
  }
  ```

## Enum Types

### `user_role`

User role enumeration.

- `'betting'`: Admin role with full access to manage tips, users, and settings
- `'customer'`: Standard user role with read-only access to active tips

### `tip_status`

Betting tip status enumeration.

- `'pending'`: Tip is active, match not yet played
- `'win'`: Tip was successful
- `'loss'`: Tip was unsuccessful

## Database Functions

### User Management Functions

#### `public.has_role(target_role user_role) → boolean`

Checks if the current authenticated user has the specified role.

**Usage:**
```sql
SELECT public.has_role('betting');
```

#### `public.is_active_customer() → boolean`

Checks if the current authenticated user is an active customer (has valid subscription).

**Usage:**
```sql
SELECT public.is_active_customer();
```

#### `public.user_has_active_account(target_user_id uuid) → boolean`

Checks if a specific user has an active account.

**Usage:**
```sql
SELECT public.user_has_active_account('user-uuid-here');
```

#### `public.is_user_account_active(target_user_id uuid) → boolean`

Alias for `user_has_active_account` with consistent naming.

#### `public.activate_account_by_email(user_email text, active_until_date timestamptz) → jsonb`

Activates a user account by email address.

**Parameters:**
- `user_email`: User's email address
- `active_until_date`: Optional expiration date (defaults to 1 year from now)

**Returns:**
```json
{
  "success": true,
  "email": "user@example.com",
  "id": "uuid",
  "role": "customer",
  "account_active_until": "2025-12-31T23:59:59Z"
}
```

**Usage:**
```sql
SELECT public.activate_account_by_email('user@example.com');
SELECT public.activate_account_by_email('user@example.com', '2025-12-31 23:59:59+00'::timestamptz);
```

### Tip Evaluation Functions

#### `public.validate_odds_range(input_odds numeric) → numeric`

Validates that odds are within the allowed range (1.001 to 2.00).

**Throws:** Exception if odds are outside range.

**Usage:**
```sql
SELECT public.validate_odds_range(1.5); -- Returns 1.5
SELECT public.validate_odds_range(3.0); -- Throws exception
```

#### `public.tip_success_rate(target_month date) → table`

Calculates success rate statistics for a specific month.

**Returns:**
| Column | Type | Description |
|--------|------|-------------|
| `month_start` | `date` | First day of the month |
| `wins` | `integer` | Number of winning tips |
| `losses` | `integer` | Number of losing tips |
| `pending` | `integer` | Number of pending tips |
| `total` | `integer` | Total tips in month |
| `success_rate` | `numeric` | Success rate percentage (wins / (wins + losses) * 100) |

**Usage:**
```sql
SELECT * FROM public.tip_success_rate('2024-11-01'::date);
```

#### `public.tip_monthly_summary(months_back integer) → table`

Returns monthly summary statistics for the last N months.

**Parameters:**
- `months_back`: Number of months to include (default: 12)

**Returns:** Same structure as `tip_success_rate` but for multiple months.

**Usage:**
```sql
SELECT * FROM public.tip_monthly_summary(6); -- Last 6 months
```

### Free Month Logic Functions

#### `public.month_has_losing_tip(target_month date) → boolean`

Checks if a specific month has any losing tips.

**Parameters:**
- `target_month`: Month to check (defaults to previous month)

**Usage:**
```sql
SELECT public.month_has_losing_tip('2024-11-01'::date);
```

#### `public.month_loss_count(target_month date) → integer`

Counts the number of losing tips in a specific month.

**Usage:**
```sql
SELECT public.month_loss_count('2024-11-01'::date);
```

#### `public.should_grant_free_month(target_month date) → boolean`

Determines if a free month should be granted based on marketing settings and loss count.

**Logic:**
1. Checks `marketing_settings` for `free_month_rules`
2. Respects `autoFreeMonth` toggle
3. Uses `lossThreshold` to determine minimum losses required
4. Returns true if losses >= threshold and auto-free-month is enabled

**Usage:**
```sql
SELECT public.should_grant_free_month('2024-11-01'::date);
```

## Triggers

### `set_updated_at()`

Generic trigger function that sets `updated_at` to current UTC timestamp.

**Applied to:**
- `public.users`
- `public.betting_tips`
- `public.marketing_settings`

### `trg_betting_tips_loss_free_month`

Triggered when a betting tip status changes to 'loss'. Automatically sets `next_month_free = true` for the corresponding month's subscription if free month rules allow it.

**Trigger:** AFTER UPDATE on `public.betting_tips`
**Condition:** Status changed to 'loss'

### `trg_user_subscriptions_free_month`

Triggered when `next_month_free` is set to `true` on a subscription. Automatically extends the user's `account_active_until` date.

**Trigger:** AFTER INSERT OR UPDATE on `public.user_subscriptions`
**Condition:** `next_month_free` changed from false to true

## Row Level Security (RLS)

All tables have RLS enabled and enforced. Policies are role-based:

### Betting Role
- Full access (SELECT, INSERT, UPDATE, DELETE) to all tables
- Can manage users, tips, settings, and subscriptions

### Customer Role
- Read-only access to own user profile
- Read access to active pending tips
- Read access to own subscription history
- Read access to completed tips (win/loss) for history

### Public/Anonymous
- Read access to reference data (sports, leagues, betting companies)
- Read access to pending tips for homepage preview
- Read access to marketing settings for homepage

## Migration Files

Database schema is managed through migration files in `supabase/migrations/`:

1. `20241119_core_tables.sql` - Core table definitions
2. `20241120_2_rls_policies.sql` - Row Level Security policies
3. `20241121_db_functions.sql` - Core database functions
4. `20241122_auth_user_trigger.sql` - Auth user sync trigger
5. `20241123_user_profile_fields.sql` - Additional user fields
6. `20241124_subscription_management.sql` - Subscription functions
7. `20241125_free_month_and_tip_logic.sql` - Free month automation
8. `20241130_fix_rls_recursion.sql` - RLS policy fixes
9. `20241131_seed_data.sql` - Initial seed data
10. `20241201_activate_account_function.sql` - Account activation function
11. `20241202_set_betting_role_function.sql` - Role management function

## Best Practices

1. **Always use RLS**: Never bypass RLS policies unless absolutely necessary
2. **Use functions**: Prefer database functions for complex business logic
3. **Index appropriately**: Add indexes for frequently queried columns
4. **Validate at database level**: Use CHECK constraints and triggers for data integrity
5. **Use transactions**: Wrap related operations in transactions
6. **Monitor performance**: Use EXPLAIN ANALYZE for slow queries

## Common Queries

### Get active tips for a customer
```sql
SELECT * FROM public.betting_tips
WHERE status = 'pending'
ORDER BY match_date ASC;
```

### Get monthly statistics
```sql
SELECT * FROM public.tip_monthly_summary(12);
```

### Check user account status
```sql
SELECT 
  email,
  role,
  account_active_until,
  public.is_user_account_active(id) as is_active
FROM public.users
WHERE email = 'user@example.com';
```

### Get subscription history
```sql
SELECT 
  month,
  next_month_free,
  valid_to
FROM public.user_subscriptions
WHERE user_id = auth.uid()
ORDER BY month DESC;
```



