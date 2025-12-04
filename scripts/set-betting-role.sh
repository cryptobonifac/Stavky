#!/bin/bash
# Script to set betting role for a user via API
# Usage: ./set-betting-role.sh <email>
# Example: ./set-betting-role.sh admin@example.com

if [ -z "$1" ]; then
    echo "Error: Email address is required"
    echo "Usage: ./set-betting-role.sh <email>"
    echo "Example: ./set-betting-role.sh admin@example.com"
    exit 1
fi

EMAIL="$1"
URL="http://localhost:3000/api/users/set-betting-role"

echo "Setting betting role for: $EMAIL"
echo ""

curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}"

echo ""
echo "Done."



