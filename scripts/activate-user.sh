#!/bin/bash
# Script to activate a user account via API
# Usage: ./activate-user.sh <email>
# Example: ./activate-user.sh customer5@gmail.com

if [ -z "$1" ]; then
    echo "Error: Email address is required"
    echo "Usage: ./activate-user.sh <email>"
    echo "Example: ./activate-user.sh customer5@gmail.com"
    exit 1
fi

EMAIL="$1"
URL="http://localhost:3000/api/users/activate"

echo "Activating account for: $EMAIL"
echo ""

curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}"

echo ""
echo "Done."



