# CampusFix – Campus Issue Reporting Platform

CampusFix is a MERN stack web application that helps students report campus maintenance issues and track their progress. Admins can assign issues to staff, manage priorities, and monitor resolutions.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

## Features

- Student registration and login.
- Secure authentication with JWT.
- Report and browse campus issues.
- Search issues by title, description, or location.
- Filter issues by category and status.
- Like and unlike issues (one like per user).
- Rank issues based on priority, likes, and submission date.
- Admin can create staff accounts and assign issues.
- Staff and admins can update issue statuses.
- Responsive user interface.

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB Community Server or MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/Aman-ai300/CampusFix.git
cd CampusFix
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Campus Admin
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=your_strong_password
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

Health check: `http://localhost:5000/api/health`

### 3. Create the admin account

Open another terminal:

```bash
cd backend
npm run seed:admin
```

This creates the initial admin account using the credentials configured in `.env`.

### 4. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example` and configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## User Roles

| Role | Responsibilities |
|---|---|
| Student | Report issues, browse reports, and like issues |
| Staff | View assigned issues and update their status |
| Admin | Manage staff, assign issues, and control priorities |

## Issue Ranking

CampusFix uses the following ranking order:

1. Critical-priority issues appear first.
2. Issues with more likes appear next.
3. Newer issues come before older issues when likes are equal.

Likes represent community support, while actual issue priority is controlled by the admin. This ensures that important safety-related issues are not overlooked simply because they receive fewer likes.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a student |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/issues` | Browse and filter issues |
| POST | `/api/issues` | Create an issue |
| GET | `/api/issues/:id` | View issue details |
| POST | `/api/issues/:id/like` | Like or unlike an issue |
| PATCH | `/api/issues/:id/status` | Update issue status |
| PATCH | `/api/issues/:id/assign` | Assign staff to an issue |
| PATCH | `/api/issues/:id/priority` | Update issue priority |
| GET | `/api/users/staff` | List staff accounts |
| POST | `/api/users/staff` | Create staff accounts |

## Project Structure

```text
CampusFix/
├── backend/
│   ├── scripts/
│   │   └── seedAdmin.js
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── api.js
│       ├── main.jsx
│       └── styles.css
│
├── .gitignore
└── README.md
```

## Future Improvements

- Email verification and password reset.
- Image uploads for issue reports.
- Pagination and request validation.
- Automated testing and audit logs.
- Rate limiting and additional security measures.

---

**CampusFix** – Making campus issue reporting simpler and more organized.
