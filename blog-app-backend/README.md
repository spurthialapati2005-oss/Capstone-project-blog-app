# Blog App Backend

Backend server for the Full Stack Blog Application built using Node.js, Express.js, and MongoDB.

This backend handles:

- Authentication
- Authorization
- Article management
- Comments
- Profile settings
- Admin moderation
- Database operations

---

# Backend Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- dotenv
- multer
- Cloudinary

---

# Backend Development Process

1. Initialized backend project

```bash
npm init -y
```

2. Installed required dependencies

3. Created Express server

4. Connected MongoDB using Mongoose

5. Created models and schemas

6. Added authentication using JWT

7. Added password hashing using bcrypt

8. Implemented protected routes

9. Added middleware for:

- token verification
- role validation
- request parsing

10. Created REST APIs

11. Added Cloudinary configuration

12. Added cookie authentication support

13. Added CORS support for frontend deployment

---

# Folder Structure

```text
backend/
├── APIs/
│   ├── AdminAPI.js
│   ├── AuthorAPI.js
│   ├── CommonAPI.js
│   └── UserAPI.js
│
├── config/
│   ├── cloudinary.js
│   ├── cloudinaryUpload.js
│   └── multer.js
│
├── middlewares/
│   ├── checkAuthor.js
│   └── verifyToken.js
│
├── models/
│   ├── ArticleModel.js
│   └── UserModel.js
│
├── services/
│   └── authService.js
│
├── req.http
├── server.js
├── package.json
└── README.md
```

---

# Main Features

- JWT authentication
- Role-based authorization
- Secure password hashing
- Cookie authentication
- User and author registration
- CRUD operations for articles
- Soft delete functionality
- Article comments
- Admin moderation APIs
- Profile update APIs

---

# APIs Used

| API          | Purpose |

| `UserAPI`    | User registration, reading articles, comments |
| `AuthorAPI`  | Author registration and article management |
| `AdminAPI`   | Admin moderation APIs |
| `CommonAPI`  | Login, logout, auth check, profile settings |

---

# Environment Variables

Create `.env` file:

# How To Run Backend

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm start
```

Server runs 

---

# Security Features

- Password hashing using bcrypt
- JWT authentication
- Protected APIs
- Role-based access control
- Cookie security
- CORS protection
- Soft delete instead of permanent deletion

---

# Testing APIs

Used:

- RESTClient
- req.http file

---

# What I Learned

- Express routing
- MongoDB schema design
- Authentication systems
- Middleware usage
- Backend security practices
- REST API development
- Deployment handling

---

# Backend Author Note

This backend was developed as a learning-focused MERN stack project by a 3rd year CSE undergraduate student to improve full stack development skills.