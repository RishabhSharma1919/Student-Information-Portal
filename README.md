# 🎓 Student Information Portal
### [Live API](https://student-information-portal-nu.vercel.app)

---

## 📋 What This Project Does

This is a **Student Information Portal** with three different user views:

| Role | What They Can Do |
|------|-----------------|
| 🔴 **Admin** | Full access — manage students, faculty, courses, enrollments, results, and user accounts |
| 🔵 **Teacher (Faculty)** | View assigned courses, see enrolled students, update student marks and grades |
| 🟢 **Student** | View their own profile, courses they are enrolled in, and their results/CGPA |

---

## 🗂️ Project Structure

```
student-portal/
├── backend/           ← Node.js + Express + Neon Postgres API
│   ├── config/
│   │   └── db.js               ← Database connection
│   ├── controllers/
│   │   ├── authController.js   ← Login, change password
│   │   ├── adminController.js  ← All admin operations
│   │   ├── studentController.js← Student data
│   │   └── facultyController.js← Faculty/teacher data
│   ├── middleware/
│   │   └── auth.js             ← JWT token verification
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── student.js
│   │   └── faculty.js
│   ├── postgres_schema.sql     ← ⭐ Run this in Neon/Postgres
│   ├── server.js               ← Main backend entry point
│   ├── .env.example            ← Copy to .env and fill in details
│   └── package.json
│
└── frontend/          ← React.js UI
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js  ← Global login state
    │   ├── utils/
    │   │   └── api.js          ← Axios HTTP client
    │   ├── components/
    │   │   └── Sidebar.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── admin/          ← Admin views
    │   │   ├── student/        ← Student views
    │   │   └── teacher/        ← Teacher views
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Prerequisites — Install These First

Before starting, you need these installed on your computer:

### 1. Node.js (Required for both frontend and backend)
- Go to: https://nodejs.org
- Download and install the **LTS version** (the green button)
- To verify: open a terminal/command prompt and type: `node --version`

### 2. PostgreSQL (The database)
- **Option A: Neon Postgres (Recommended)**
  - Go to https://neon.tech and create a free account.
  - Create a new project and copy your **Connection String**.
- **Option B: Local PostgreSQL**
  - Download from: https://www.postgresql.org/download/
  - Set a password and remember it!

### 3. pgAdmin (Optional — visual tool for PostgreSQL)
- Download from: https://www.pgadmin.org/download/

---

## 🚀 Step-by-Step Setup

### STEP 1: Set Up the Database

1. Open your **PostgreSQL tool** (Neon SQL Editor, pgAdmin, or psql)
2. Open the file `backend/postgres_schema.sql` from this project
3. Run the entire file — it will:
   - Create all the tables (students, faculty, courses, etc.)
   - Insert sample data (10 students, 6 faculty, 10 courses)

**Note:** If using Neon, you can just paste the contents of `backend/postgres_schema.sql` into the SQL Editor and click **Run**.

---

### STEP 2: Configure the Backend

1. Go into the `backend` folder
2. Copy `.env.example` and rename the copy to `.env` (or update existing `.env`)
3. Open `.env` and fill in your details:

```env
DATABASE_URL=your_postgresql_connection_string_here
JWT_SECRET=any_long_random_string_here      ← CHANGE THIS
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

### STEP 3: Install and Start the Backend

Open a **terminal / command prompt** and run these commands:

```bash
# Go into the backend folder
cd backend

# Install all required packages
npm install

# Start the backend server
npm run dev
```

You should see:
```
✅ Neon Postgres Connected Successfully!
🚀 Student Portal Backend running on http://localhost:5000
```

**Leave this terminal window open!**

---

### STEP 4: Install and Start the Frontend

Open a **second terminal window** (keep the first one running) and run:

```bash
# Go into the frontend folder
cd frontend

# Install all required packages
npm install

# Start the React app
npm start
```

Your browser should automatically open to `http://localhost:3000`

---

## 🌐 Accessing the Portal

Once both are running, open your browser and go to:

```
http://localhost:3000
```

You will see the **Login Page** with demo accounts to click on.

### The Three URLs
| URL | For |
|-----|-----|
| `http://localhost:3000/login` | Login page (all users start here) |
| `http://localhost:3000/admin` | Admin dashboard (auto-redirected after login) |
| `http://localhost:3000/student` | Student dashboard |
| `http://localhost:3000/teacher` | Teacher dashboard |

---

---

## 🔌 API Endpoints Reference

### Auth
- `POST /api/auth/login` — Login with email + password
- `GET  /api/auth/profile` — Get logged-in user info
- `PUT  /api/auth/change-password` — Change own password

### Admin (requires admin login)
- `GET    /api/admin/dashboard` — Stats
- `GET    /api/admin/students` — All students
- `POST   /api/admin/students` — Create student
- `PUT    /api/admin/students/:id` — Update student
- `DELETE /api/admin/students/:id` — Delete student
- `GET    /api/admin/faculty` — All faculty
- `POST   /api/admin/faculty` — Create faculty
- `GET    /api/admin/courses` — All courses
- `POST   /api/admin/courses` — Create course
- `GET    /api/admin/enrollments` — All enrollments
- `POST   /api/admin/enrollments` — Enroll student
- `GET    /api/admin/results` — All results
- `PUT    /api/admin/results/:id` — Edit result
- `GET    /api/admin/users` — All user accounts
- `PUT    /api/admin/users/:id/reset-password` — Reset password

### Student (requires student login)
- `GET /api/student/profile` — Own profile
- `GET /api/student/enrollments` — Own courses
- `GET /api/student/results` — Own results
- `GET /api/student/results/summary` — CGPA summary

### Faculty/Teacher (requires faculty login)
- `GET /api/faculty/profile` — Own profile
- `GET /api/faculty/courses` — Assigned courses
- `GET /api/faculty/courses/:id/students` — Students in a course
- `GET /api/faculty/courses/:id/summary` — Grade distribution
- `PUT /api/faculty/results/:id` — Update a student's result

---

---

## 🗃️ Database Schema Summary

```
users          → login credentials for everyone (email, password_hash, role)
departments    → CS, Math, Physics, ECE, Civil
students       → linked to users; has roll_number, year_of_study, dept
faculty        → linked to users; has designation, dept
courses        → has course_code, credits, semester, assigned faculty
enrollments    → links student ↔ course (many-to-many)
results        → one result per enrollment (marks_internal, marks_external, grade)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Styling | Pure CSS with CSS Variables |

---
255: 
---



---

DEPLOYED PROJECT LINK :-   https://student-information-portal-nu.vercel.app/
