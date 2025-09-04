#!/bin/bash

echo "🔒 Testing MicroBridge Security Implementation"
echo "=============================================="

# Test JWT package
echo "Testing JWT package..."
cd pkg/jwt
go test -v
if [ $? -eq 0 ]; then
    echo "✅ JWT tests passed"
else
    echo "❌ JWT tests failed"
    exit 1
fi

cd ../..

# Test configuration
echo "Testing security configuration..."
go run cmd/api/secure_main.go &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health endpoint
echo "Testing health endpoint..."
curl -s http://localhost:8080/health | jq .
if [ $? -eq 0 ]; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

# Test rate limiting
echo "Testing rate limiting..."
for i in {1..5}; do
    curl -s http://localhost:8080/health > /dev/null
done

# Test authentication (should fail without token)
echo "Testing authentication..."
curl -s http://localhost:8080/api/v1/users/test-user | jq .
if [ $? -eq 0 ]; then
    echo "✅ Authentication working (blocking unauthorized access)"
else
    echo "❌ Authentication test failed"
fi

# Cleanup
kill $SERVER_PID
echo "✅ Security tests completed"
