# API Endpoints Documentation

Complete list of all HTTP endpoints for Resources, Courses, Services, and Categories.

**Base URL:** `http://localhost:3001/api/v1` (Development)  
**Authentication:** Bearer token in `Authorization` header for protected routes

---

## 📚 Resources API

### Public Endpoints

#### 1. Get All Resources
```http
GET /v1/resources
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by category name
- `tags` (string, optional): Comma-separated tags
- `difficulty` (string, optional): `beginner` | `intermediate` | `advanced`
- `search` (string, optional): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Resources retrieved successfully"
}
```

#### 2. Get Resource by ID
```http
GET /v1/resources/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resource": {
      "_id": "...",
      "title": "...",
      "description": "...",
      "category": "...",
      "tags": [...],
      "link": "...",
      "difficulty": "beginner",
      "createdBy": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  },
  "message": "Resource retrieved successfully"
}
```

### Authenticated User Endpoints

#### 3. Get All Bookmarked Resources
```http
GET /v1/resources/bookmarks/all
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [...],
    "count": 5
  },
  "message": "Bookmarked resources retrieved successfully"
}
```

#### 4. Toggle Bookmark
```http
POST /v1/resources/:id/bookmark
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "bookmarked": true
  },
  "message": "Resource bookmarked successfully"
}
```

### Admin-Only Endpoints

#### 5. Create Resource
```http
POST /v1/resources
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Resource Title",
  "description": "Resource description (min 10 chars)",
  "link": "https://example.com",
  "category": "Frontend",
  "tags": ["tag1", "tag2"],
  "difficulty": "beginner",
  "thumbnail": "https://example.com/image.jpg" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resource": {...}
  },
  "message": "Resource created successfully"
}
```

#### 6. Update Resource
```http
PATCH /v1/resources/:id
PUT /v1/resources/:id
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "link": "https://updated.com",
  "category": "Backend",
  "tags": ["new", "tags"],
  "difficulty": "intermediate",
  "thumbnail": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resource": {...}
  },
  "message": "Resource updated successfully"
}
```

#### 7. Delete Resource (Soft Delete)
```http
DELETE /v1/resources/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

## 🎓 Courses API

### Public Endpoints

#### 1. Get All Courses
```http
GET /v1/courses
```

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): `beginner` | `intermediate` | `advanced`
- `search` (string, optional): Search query

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {...}
  },
  "message": "Courses retrieved successfully"
}
```

#### 2. Get Course by ID
```http
GET /v1/courses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {...}
  },
  "message": "Course retrieved successfully"
}
```

### Authenticated User Endpoints

#### 3. Enroll in Course
```http
POST /v1/courses/:id/enroll
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {...}
  },
  "message": "Enrolled in course successfully"
}
```

#### 4. Get Course Enrollment
```http
GET /v1/courses/:id/enrollment
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "progress": 50,
      "completedLessons": [...],
      "enrolledAt": "..."
    }
  },
  "message": "Enrollment retrieved successfully"
}
```

#### 5. Update Course Progress
```http
PATCH /v1/courses/:id/progress
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "lessonId": "lesson123",
  "completed": true,
  "progress": 75
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {...}
  },
  "message": "Progress updated successfully"
}
```

### Admin-Only Endpoints

#### 6. Create Course
```http
POST /v1/courses
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "category": "Frontend",
  "price": 99,
  "lessons": [...],
  "thumbnail": "https://example.com/image.jpg",
  "difficulty": "beginner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {...}
  },
  "message": "Course created successfully"
}
```

#### 7. Update Course
```http
PATCH /v1/courses/:id
PUT /v1/courses/:id
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:** (All fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {...}
  },
  "message": "Course updated successfully"
}
```

#### 8. Delete Course
```http
DELETE /v1/courses/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 💼 Services API

### Public Endpoints

#### 1. Get All Services
```http
GET /v1/services
```

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `category` (string, optional): Filter by category (`resume` | `interview` | `mentorship` | `portfolio` | `crash-course`)
- `search` (string, optional): Search query
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [...],
    "pagination": {...}
  },
  "message": "Services retrieved successfully"
}
```

#### 2. Get Service by ID or Slug
```http
GET /v1/services/:idOrSlug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "...",
      "name": "Service Name",
      "slug": "service-slug",
      "description": "...",
      "price": 149,
      "category": "interview",
      "deliverables": [...],
      "availability": true,
      "createdBy": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  },
  "message": "Service retrieved successfully"
}
```

### Admin-Only Endpoints

#### 3. Create Service
```http
POST /v1/services
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Service Name",
  "slug": "service-slug",
  "description": "Service description",
  "price": 149,
  "category": "interview",
  "deliverables": ["Item 1", "Item 2"],
  "availability": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {...}
  },
  "message": "Service created successfully"
}
```

#### 4. Update Service
```http
PATCH /v1/services/:id
PUT /v1/services/:id
```

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:** (All fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {...}
  },
  "message": "Service updated successfully"
}
```

#### 5. Delete Service
```http
DELETE /v1/services/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## 📁 Categories

**Note:** Categories are currently handled as static data in the frontend. If you need category management endpoints, they would follow a similar pattern:

### Potential Category Endpoints (Not Currently Implemented)

```http
GET    /v1/categories          # Get all categories
GET    /v1/categories/:id      # Get category by ID
POST   /v1/categories          # Create category (Admin)
PATCH  /v1/categories/:id      # Update category (Admin)
DELETE /v1/categories/:id      # Delete category (Admin)
```

---

## 🔐 Authentication

All protected endpoints require authentication:

```http
Authorization: Bearer <access_token>
```

**Admin endpoints** require the user to have `role: 'admin'` in their JWT token.

---

## 📝 Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized/admin)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 🧪 Testing Examples

### Using cURL

**Create Resource (Admin):**
```bash
curl -X POST http://localhost:3001/api/v1/resources \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Resource",
    "description": "This is a test resource description",
    "link": "https://example.com",
    "category": "Frontend",
    "tags": ["test", "example"],
    "difficulty": "beginner"
  }'
```

**Get Resources:**
```bash
curl http://localhost:3001/api/v1/resources?page=1&limit=10&category=Frontend
```

**Update Resource (Admin):**
```bash
curl -X PATCH http://localhost:3001/api/v1/resources/RESOURCE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Delete Resource (Admin):**
```bash
curl -X DELETE http://localhost:3001/api/v1/resources/RESOURCE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📌 Notes

1. **Soft Delete:** Resources and Courses use soft delete (sets `deletedAt` field) - they're not permanently removed
2. **Pagination:** All list endpoints support pagination with `page` and `limit` parameters
3. **Filtering:** Most list endpoints support filtering by category, difficulty, and search
4. **Validation:** All POST/PATCH requests are validated using Zod schemas
5. **Rate Limiting:** API endpoints have rate limiting (disabled in development mode)

