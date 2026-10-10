# CRM Backend API

A Node.js REST API for managing student enquiries and counselor assignments. The application supports employee authentication, public enquiry submission, lead claiming, and counselor-specific enquiry listing.

## 1. Prerequisites

- Node.js 20.19 or later
- npm
- MySQL 8.0.16 or later
- Postman or cURL for API testing

## 2. Project Setup

Clone the repository or navigate to the project directory.

```bash
npm install
```

Create a `.env` file in the project root using `.env.example` as a reference.

Configure the following environment variables:

```dotenv
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fastor_ai_crm
DB_CONNECTION_LIMIT=10

JWT_SECRET=fastor_ai_crm_token_secret_32_characters
JWT_EXPIRES_IN=1h

CORS_ORIGIN=http://localhost:3000
```

Replace the database credentials and JWT secret with your local configuration.

## 3. Database Setup

The database schema is available at:

`database/schema.sql`

The schema creates the `fastor_ai_crm` database and the required tables, constraints, relationships, and indexes.

### Restore the Database

From the project root, execute the following command in PowerShell:

```powershell
Get-Content .\database\schema.sql -Raw | mysql -u root -p
```

Enter your MySQL root password when prompted.

Alternatively, from Windows Command Prompt (CMD):

```cmd
mysql -u root -p < database/schema.sql
```

### Verify the Database

```sql
USE fastor_ai_crm;

SHOW TABLES;

DESCRIBE employees;
DESCRIBE enquiries;
```

Expected tables:

- `employees`
- `enquiries`

**Note:** The schema file creates the initial database structure. Re-running it does not automatically migrate or update existing tables. Back up existing data before making schema changes.

## 4. Start the Application

Start the application in development mode:

```bash
npm run dev
```

Start the application normally:

```bash
npm start
```

The default API base URL is:

`http://localhost:5000/api/v1`

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

Response:
{
    "success": true,
    "message": "CRM API is running."
}

## 5. API Authentication

The registration, login, and public enquiry submission endpoints do not require JWT authentication.

The counselor enquiry listing and claim endpoints require a valid JWT access token.

For protected endpoints, include the following header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Obtain the token from the login endpoint and use it in subsequent protected requests.

## 6. API Endpoints

### 6.1 Register Employee

**Endpoint:** `POST /api/v1/auth/register`

**Authentication:** Not required.

cURL:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "password": "CRM@123"
  }'
```

Response:
{
    "success": true,
    "message": "Employee registered successfully.",
    "data": {
        "employee": {
            "id": 1,
            "name": "Rahul Sharma",
            "email": "rahul@example.com"
        }
    }
}

### 6.2 Employee Login

**Endpoint:** `POST /api/v1/auth/login`

**Authentication:** Not required.

cURL:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul@example.com",
    "password": "CRM@123"
  }'
```

Response:
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaHVsQGV4YW1wbGUuY29tIiwiaWF0IjoxNzkxNjIzMjc0LCJleHAiOjE3OTE2MjY4NzQsInN1YiI6IjEifQ.w7eQctxQDWsuF7e8Xmvib5o0Ml1U7h6iUPD91pH_dG4",
        "employee": {
            "id": 1,
            "name": "Rahul Sharma",
            "email": "rahul@example.com"
        }
    }
}

Copy the returned JWT token for protected API requests.

### 6.3 Submit Public Enquiry

**Endpoint:** `POST /api/v1/enquiries`

**Authentication:** Not required.

cURL:

```bash
curl -X POST http://localhost:5000/api/v1/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ankit Sharma",
    "email": "ankit@example.com",
    "courseInterest": "Full Stack Development"
  }'
```

Response:
{
    "success": true,
    "message": "Enquiry submitted successfully.",
    "data": {
        "enquiry": {
            "id": 1,
            "name": "Ankit Sharma",
            "email": "ankit@example.com",
            "courseInterest": "Full Stack Development",
            "status": "unclaimed",
            "claimedBy": null,
            "createdAt": "2026-10-10T14:53:59.651Z",
            "updatedAt": "2026-10-10T14:53:59.651Z"
        }
    }
}

### 6.4 Fetch Unclaimed Enquiries

**Endpoint:** `GET /api/v1/enquiries/unclaimed`

**Authentication:** JWT required.

**Pagination:** Offset-based pagination using `page` and `limit`.

Query parameters:

| Parameter | Description | Default |
|---|---|---|
| `page` | Page number, starting from 1 | `1` |
| `limit` | Number of records per page | `20` |
| Maximum limit | Maximum records per request | `100` |

cURL:

```bash
curl "http://localhost:5000/api/v1/enquiries/unclaimed?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
{
    "success": true,
    "message": "Unclaimed enquiries retrieved successfully.",
    "data": [
        {
            "id": 1,
            "name": "Ankit Sharma",
            "email": "ankit@example.com",
            "courseInterest": "Full Stack Development",
            "status": "unclaimed",
            "createdAt": "2026-10-10T14:53:59.651Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "totalRecords": 1,
        "totalPages": 1
    }
}

### 6.5 Claim an Enquiry

**Endpoint:** `PATCH /api/v1/enquiries/:id/claim`

**Authentication:** JWT required.

Replace `:id` with the enquiry ID. The authenticated employee becomes the owner of the enquiry.

cURL:

```bash
curl -X PATCH http://localhost:5000/api/v1/enquiries/1/claim \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

No request body is required.

An enquiry can be claimed by only one counselor. If another counselor has already claimed it, the API should return a conflict response.

Response:
{
    "success": true,
    "message": "Enquiry claimed successfully.",
    "data": {
        "enquiry": {
            "id": 1,
            "name": "Ankit Sharma",
            "email": "ankit@example.com",
            "courseInterest": "Full Stack Development",
            "status": "claimed",
            "claimedBy": 1,
            "createdAt": "2026-10-10T14:53:59.651Z",
            "updatedAt": "2026-10-10T14:57:25.493Z"
        }
    }
}

### 6.6 Fetch My Enquiries

**Endpoint:** `GET /api/v1/enquiries/my-leads`

**Authentication:** JWT required.

Returns enquiries claimed by the currently authenticated employee.

Query parameters:

| Parameter | Description | Default |
|---|---|---|
| `page` | Page number, starting from 1 | `1` |
| `limit` | Number of records per page | `20` |
| Maximum limit | Maximum records per request | `100` |

cURL:

```bash
curl "http://localhost:5000/api/v1/enquiries/my-leads?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
{
    "success": true,
    "message": "Your enquiries retrieved successfully.",
    "data": [
        {
            "id": 1,
            "name": "Ankit Sharma",
            "email": "ankit@example.com",
            "courseInterest": "Full Stack Development",
            "status": "claimed",
            "claimedBy": 1,
            "createdAt": "2026-10-10T14:53:59.651Z",
            "updatedAt": "2026-10-10T14:57:25.493Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "totalRecords": 1,
        "totalPages": 1
    }
}

## 7. Pagination

The enquiry listing endpoints use offset-based pagination.

Example requests:

```http
GET /api/v1/enquiries/unclaimed?page=1&limit=20
GET /api/v1/enquiries/unclaimed?page=2&limit=20
GET /api/v1/enquiries/my-leads?page=1&limit=50
```

The API should enforce a minimum page number of `1` and a maximum page size of `100`.

Pagination responses should include the returned records and metadata such as the current page, page size, total records, and total pages, where supported by the implementation.

## 8. Error Handling

The API uses centralized error-handling middleware to return consistent error responses.

Common HTTP status codes:

| Status | Description |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request parameters or payload |
| `401 Unauthorized` | Missing or invalid authentication token |
| `404 Not Found` | Requested resource or endpoint not found |
| `409 Conflict` | Duplicate email or an already-claimed enquiry |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |

## 9. Implementation Notes

- Employee passwords are stored as bcrypt hashes.
- JWT authentication is applied centrally to protected route groups.
- SQL queries use parameterized statements.
- Database constraints enforce relationships and ownership consistency.
- Enquiry listing endpoints use pagination and database indexes.
- Public enquiry submission does not require authentication.
- Only the assigned counselor should receive their private enquiries.

## 10. Current Implementation Status

The authentication module and application foundation should be verified first. Enquiry endpoints must be implemented and tested before they can be considered available.

Record actual HTTP status codes and response payloads in the response sections above after testing each endpoint.
