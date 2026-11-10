# CampusFix

A campus issue reporting platform built with the MERN stack. Students can report maintenance issues, track updates and support existing reports through likes. Admins can assign issues to staff and manage their status.

## Features

- Student registration and login
- Create, view and search campus issues
- Filter issues by category and status
- Like and unlike reported issues
- Priority-based issue ranking
- Admin dashboard for staff management and issue assignment
- Staff can update issue status
- Responsive interface

## Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

## Getting Started

**Prerequisites:** Node.js 18+ and MongoDB.

### Backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure your MongoDB URI, JWT secret and admin credentials.

```bash
npm run dev
```

Create the initial admin account in another terminal:

```bash
cd backend
npm run seed:admin
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` to use CampusFix.

## Project Structure

```text
CampusFix/
├── backend/
│   ├── scripts/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       └── routes/
│
└── frontend/
    └── src/
        ├── components/
        ├── context/
        └── pages/
```

## User Roles

- **Student:** Reports campus issues, views existing reports and supports issues through likes.
- **Staff:** Views assigned issues and updates their status.
- **Admin:** Manages staff accounts, assigns issues to staff and manages issue priorities.
