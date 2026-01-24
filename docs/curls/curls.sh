# base
BASE_URL="http://localhost:3000"
TOKEN="REEMPLAZA_CON_JWT"

# health/root
curl -X GET "$BASE_URL/"

# auth/register
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Juan Perez",
    "role": "STUDENT"
  }'

# auth/login
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# users/me (requiere JWT)
curl -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer '"$TOKEN"'"

# wallet award (requiere JWT con rol ADMIN o TEACHER)
curl -X POST "$BASE_URL/students/<studentId>/award" \
  -H "Authorization: Bearer '"$TOKEN"'" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "COINS",
    "amount": 10,
    "reason": "Buen trabajo",
    "refType": "assignment",
    "refId": "A-123"
  }'
