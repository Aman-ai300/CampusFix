# CampusFix — MERN Campus Issue Reporting Platform

A portfolio-ready MERN starter application for reporting campus maintenance issues, supporting issues with likes, and managing assignments/statuses.

## Stack
- **MongoDB** — database
- **Express + Node.js** — REST API
- **React + Vite** — frontend
- **Mongoose** — MongoDB object modeling
- **JWT + bcryptjs** — authentication and password hashing

## Features included
- Student registration and login
- JWT-protected routes
- Create and browse campus issues
- Search by title, description, or location
- Filter by category and status
- Like/unlike an issue (one like per user; users cannot like their own issue)
- Community ranking: Critical issues are pinned first, then issues are sorted by like count, then newest
- Admin can create staff accounts, assign issues, and set actual priority
- Staff/admin can update issue status
- Responsive React interface

## Requirements
- Node.js 18 or newer
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env` and set a strong unique `JWT_SECRET`, your `MONGO_URI`, and a strong `ADMIN_PASSWORD` (do not use the example password).

Install and start the API:
```bash
npm install
npm run dev
```
The API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 2. Create the first admin
In a second terminal:
```bash
cd backend
npm run seed:admin
```
The script creates the admin from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`. It will refuse the example password. Keep the admin credentials private.

## 3. Configure and start the frontend
In a third terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

## 4. Add staff
Register a normal student account first only if you want to test the student flow. Sign in with the seeded admin credentials. Staff creation is exposed through `POST /api/users/staff` and is admin-only. Example request body:
```json
{"name":"Facilities Team","email":"facilities@college.edu","password":"UseAUniquePassword123"}
```
Use an API client such as Postman with the admin JWT in `Authorization: Bearer <token>`. The admin can then assign issues to the new staff account from an issue detail page.

## API overview
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Signed in | Current user |
| GET | `/api/issues` | Signed in | List, search, filter, rank issues |
| POST | `/api/issues` | Student/admin | Create issue |
| GET | `/api/issues/:id` | Signed in | Issue detail |
| POST | `/api/issues/:id/like` | Signed in | Toggle like |
| PATCH | `/api/issues/:id/status` | Staff/admin | Update status |
| PATCH | `/api/issues/:id/assign` | Admin | Assign staff |
| PATCH | `/api/issues/:id/priority` | Admin | Set actual urgency |
| GET | `/api/users/staff` | Admin | List staff |
| POST | `/api/users/staff` | Admin | Create staff account |

## Like and ranking logic
The `likes` field is an array of user ObjectIds on each Issue document. The API uses MongoDB `$addToSet` to add a user only once and `$pull` to remove a like. The list endpoint calculates `likeCount` using `$size` in an aggregation pipeline. Ranking is:
1. Critical priority first (safety must not be buried by popularity)
2. Highest like count
3. Newest issue as tie-breaker

Likes represent community support, not verified severity. Admin-controlled priority remains separate. This helps prevent a popular but low-risk issue from outranking a safety-critical report.

## Important production improvements before public deployment
This is an MVP starter, not a hardened production service. Before deploying publicly, add rate limiting, email verification, password reset, request validation (for example Zod/Joi), audit logs, pagination, image upload with safe file validation, automated tests, and stricter CORS/security headers. For high traffic, consider a separate Like collection with a unique compound index on `{ issueId, userId }` rather than embedding every liker in the issue document.

## Project structure
```text
campusfix-mern/
  backend/
    scripts/seedAdmin.js
    src/config/db.js
    src/middleware/auth.js
    src/models/{User,Issue}.js
    src/routes/{auth,issues,users}.js
    src/server.js
  frontend/
    src/components/{Layout,ProtectedRoute}.jsx
    src/context/AuthContext.jsx
    src/pages/{AuthPage,Dashboard,ReportIssue,IssueDetail}.jsx
    src/{api.js,main.jsx,styles.css}
```
