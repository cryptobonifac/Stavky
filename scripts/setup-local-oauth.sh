#!/bin/bash
# Bash script to set up Google OAuth environment variables for local Supabase
# Run this before starting Supabase: supabase start

echo "Setting up Google OAuth for local Supabase..."

# Prompt for Google OAuth credentials
read -p "Enter your Google OAuth Client ID: " GOOGLE_CLIENT_ID
read -sp "Enter your Google OAuth Client Secret: " GOOGLE_CLIENT_SECRET
echo

# Set environment variables
export GOOGLE_CLIENT_ID
export GOOGLE_CLIENT_SECRET
export GOOGLE_REDIRECT_URL="http://localhost:54321/auth/v1/callback"

echo ""
echo "Environment variables set:"
echo "  GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"
echo "  GOOGLE_CLIENT_SECRET: [HIDDEN]"
echo "  GOOGLE_REDIRECT_URL: $GOOGLE_REDIRECT_URL"
echo ""
echo "Next steps:"
echo "1. Make sure Google Console has this redirect URI: http://localhost:54321/auth/v1/callback"
echo "2. Start Supabase: supabase start"
echo "3. Start your app: npm run dev"
echo ""
echo "Note: These environment variables are only set for this shell session."
echo "If you open a new terminal, run this script again or set them manually."

