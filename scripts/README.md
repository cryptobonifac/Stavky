# Scripts

This directory contains utility scripts for managing the Stavky application.

## create-betting-user.js

Creates a new user in Supabase Auth and sets their role in the public.users table.

### Usage

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the script
node scripts/create-betting-user.js <email> <password> [role]
```

### Example

```bash
node scripts/create-betting-user.js betting1@gmail.com betting123 betting
```

### Parameters

- `email` (required): User's email address
- `password` (required): User's password
- `role` (optional): User role ('betting' or 'customer'). Defaults to 'betting'

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in Supabase Dashboard → Settings → API)

### Notes

- The script automatically confirms the user's email
- If the user already exists in auth.users, it will update their role in public.users
- The script uses the service role key, so it has full admin access

## Other Scripts

- `set-betting-role.*`: Scripts to change an existing user's role to 'betting'
- `activate-user.*`: Scripts to activate a user's account







