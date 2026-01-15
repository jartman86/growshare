#!/bin/bash

echo "🧪 Testing GrowShare API Endpoints"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3

    echo -n "Testing $description... "

    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint")

    if [ "$response" = "401" ] || [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✓${NC} (Status: $response)"
    else
        echo -e "${RED}✗${NC} (Status: $response)"
    fi
}

echo "📡 API Endpoint Status Check"
echo "----------------------------"

# Bookings API
test_endpoint "GET" "/api/bookings" "Bookings endpoint"

# Messages API
test_endpoint "GET" "/api/messages" "Messages endpoint"

# Notifications API
test_endpoint "GET" "/api/notifications" "Notifications endpoint"
test_endpoint "GET" "/api/notifications/unread-count" "Notification count endpoint"

# Reviews API
test_endpoint "GET" "/api/reviews" "Reviews endpoint"

echo ""
echo "📊 Database Schema Check"
echo "------------------------"

# Check if Notification table exists
echo -n "Checking Notification table... "
if npx prisma db execute --stdin <<< "SELECT 1 FROM \"Notification\" LIMIT 1;" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Table exists"
else
    echo -e "${RED}✗${NC} Table missing - Migration needed"
    echo ""
    echo -e "${YELLOW}⚠️  Run: npx prisma generate && npx prisma db push${NC}"
fi

echo ""
echo "✅ Test complete!"
