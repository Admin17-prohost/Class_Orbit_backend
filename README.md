````md
# Class Orbit Backend

Class Orbit is a smart college timetable management backend built with Node.js, Express.js, PostgreSQL, Sequelize, JWT, and bcrypt.

## Features

- Role-based authentication
- Admin, HOD, Staff, Official, Student login
- HOD Management CRUD
- Staff Management CRUD
- User Management for Official/Student
- Department Management
- Class Management
- Subject Management
- Room/Lab Management
- Subject Allocation
- Auto Timetable Generator
- Timetable Edit / Move / Delete
- Staff Free Hour Check
- Class Hour Check
- Document Upload / Download
- Settings Module
- Dashboard APIs
- Notification / Class Alert Module

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt Password Hashing
- Multer File Upload
- CORS
- dotenv

## Folder Structure

```txt
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```
````

````md
## Installation

```bash
npm install
```

## Environment Variables

Create `.env` file:

```env
PORT=5000

DB_NAME=class_orbit_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=class_orbit_secret_key
```

## Run Project

```bash
npm run dev
```

Server runs at:

```txt
http://localhost:5000
```

## API Modules

```txt
/api/auth
/api/hods
/api/staff
/api/users
/api/departments
/api/classes
/api/subjects
/api/rooms
/api/subject-allocations
/api/timetables
/api/documents
/api/settings
/api/dashboard
/api/notifications
```

## Authentication

### Admin Register

```txt
POST /api/auth/register
```

```json
{
  "name": "Admin",
  "email": "admin@classorbit.com",
  "password": "admin123",
  "role": "admin",
  "department": "Computer Science"
}
```

### Login

```txt
POST /api/auth/login
```

```json
{
  "email": "admin@classorbit.com",
  "password": "admin123"
}
```

Use token:

```txt
Authorization: Bearer YOUR_TOKEN
```

## Role Access

| Role     | Access                             |
| -------- | ---------------------------------- |
| Admin    | Full backend access                |
| HOD      | Management + timetable access      |
| Staff    | Dashboard + timetable view/check   |
| Official | Staff free-hour + class hour check |
| Student  | Class hour check                   |

## Git Ignore

```txt
node_modules
.env
src/uploads/documents
```

## Status

Backend core modules are under development and ready for API testing with Postman.

```

```
````
