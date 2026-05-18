# Full Stack Blog Application

A full stack MERN blog platform developed as part of my web development learning journey.  
This project supports multiple account roles like readers, authors, and admins with secure authentication, protected routes, article management, and responsive UI design.

The main goal of this project was to understand how real-world full stack applications are built, connected, secured, and deployed.

---

# Project Overview

This application supports three account types:

- `USER`   → Can read active articles and comment on them.
- `AUTHOR` → Can create, edit, manage, and soft-delete their own articles.
- `ADMIN`  → Can log in with admin credentials and moderate users/articles.

The project includes:

- JWT authentication
- Protected routes
- Role-based access control
- Author dashboard
- User profile settings
- Theme preferences
- Article comments
- Soft delete functionality
- Backend validation and security

---

# Repository Structure
```text
project-root/
├── backend/
│   ├── APIs/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── services/
│   ├── req.http
│   ├── server.js
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── README.md
│
├── vercel.json
└── README.md
```

---

# Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Zustand
- Axios
- React Hook Form
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- cookie-parser
- CORS
- dotenv
- multer
- Cloudinary

---

# Features

- User and author registration
- Secure login system
- JWT authentication using cookies
- Protected routes
- Role-based dashboards
- Create, edit, and delete articles
- Soft delete articles
- Comment system
- Profile customization
- Theme switching
- Session persistence
- Admin moderation APIs
- Responsive UI
- Cloudinary configuration for uploads

---
```text
# APIs Used

| API          | Purpose |

| `UserAPI`    | User registration, reading articles, comments |
| `AuthorAPI`  | Author registration and article management |
| `AdminAPI`   | Admin moderation APIs |
| `CommonAPI`  | Login, logout, auth check, profile settings |
```
---

# How To Run Locally

## Backend

```bash
cd backend
npm install
npm start
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

# Deployment

- Frontend deployed using Vercel
- Backend deployed using Render
- MongoDB Atlas used for database hosting

---

# What I Learned From This Project

- Building complete MERN applications
- Authentication and authorization
- REST API development
- MongoDB schema design
- React state management
- Secure cookie handling
- Deployment process
- Real-world project structure
- Debugging frontend/backend integration issues

---

# Author

Developed as a MERN stack learning project by a 3rd year CSE undergraduate student.