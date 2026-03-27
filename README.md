# Campus Sarthi — Placement Portal

A full-stack placement portal for students to browse companies, check eligibility, apply, and track analytics.

## Features

- 🔐 User Authentication (Register/Login with JWT)
- 🎓 Role-based access: Student, Faculty, Recruiter
- 🏢 Company Listings with Eligibility Criteria
- ✅ Automatic Eligibility Check per student
- 📊 Placement Analytics Dashboard
- 🎯 Personalized Company Recommendations
- 📋 Application Tracking

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML, CSS, JavaScript               |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB                             |
| Auth       | JWT (JSON Web Tokens) + bcryptjs    |

## Project Structure

```
placement-portal/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── student.html            # Student dashboard
├── faculty.html            # Faculty dashboard
├── dashboard.html          # General dashboard
├── companies.html          # Company listings
├── company-details.html    # Company detail view
├── analytics.html          # Placement analytics
├── visitor.html            # Visitor/public view
├── assets/
│   ├── css/style.css       # Global styles
│   └── js/
│       ├── api.js          # API helper functions
│       └── script.js       # Frontend logic
└── backend/
    ├── server.js           # Express server entry point
    ├── package.json        # Node dependencies
    ├── .env.example        # Environment variable template
    ├── middleware/
    │   └── auth.js         # JWT verification middleware
    ├── models/
    │   ├── User.js         # User schema (student/faculty/recruiter)
    │   ├── Company.js      # Company schema
    │   └── Application.js  # Application schema
    └── routes/
        ├── auth.js         # POST /api/auth/register, /api/auth/login
        ├── placement.js    # GET/POST /api/placement/companies, analytics
        ├── events.js       # GET /api/events
        └── notices.js      # GET /api/notices
```

## Setup Instructions

### 1. Install Prerequisites

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** v6+ → https://www.mongodb.com/try/download/community
  - During Windows install: check **"Install MongoDB as a Service"**

### 2. Clone the Repository

```bash
git clone https://github.com/kunal900108/placement-portal.git
cd placement-portal
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

```bash
# In the backend/ folder:
cp .env.example .env
# Edit .env if you want to change MONGO_URI or JWT_SECRET
```

### 5. Seed the Database with Sample Companies

Open MongoDB shell:
```bash
mongosh
use smart-campus
```
Then paste the contents of `seed-data.js` and run.

### 6. Start the Backend Server

```bash
# Inside backend/ folder:
npm start
# OR for auto-reload during development:
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Server running on http://localhost:5000
```

### 7. Open the Frontend

Open `http://localhost:5000` in your browser — the Express server serves the frontend automatically.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/placement/companies` | List all companies | No |
| GET | `/api/placement/companies/:id` | Get company details | No |
| POST | `/api/placement/companies/:id/apply` | Apply to company | Yes |
| GET | `/api/placement/applications` | My applications | Yes |
| GET | `/api/placement/analytics` | My placement analytics | Yes |
| GET | `/api/events` | List events | No |
| GET | `/api/notices` | List notices | No |

## Default Test Account

After registering, you can log in immediately. No default admin account — just register one.

## License

MIT
