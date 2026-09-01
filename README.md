# Resolve Desk - Student Grievance Portal

A full-stack web application built to help college students submit and track grievances/complaints, and allow college administration/authority to manage and resolve them.

---

## Features

- **User Authentication**: Student signup/login with JWT and email OTP verification.
- **Submit Grievances**: Students can file complaints with title, category, and description.
- **Track Status**: Real-time status updates (Pending, In Progress, Resolved, Rejected).
- **Admin & Authority Dashboard**: View all submitted complaints, filter by status, and update resolution status.
- **Email Notifications**: Automatic OTPs and updates using Nodemailer.

---

## Tech Stack

- **Frontend**: React 19, Vite, Lucide React, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth & Tools**: JWT, Bcrypt, Nodemailer, Concurrently

---

## Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/PiyushKumar9341/Resolve-Desk.git
   cd Resolve-Desk
   ```

2. **Install dependencies**
   Run install in the root folder and the client folder:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root (you can refer to `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/student_grievance_db
   JWT_SECRET=your_jwt_secret_key

   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Run the Project**
   Start both backend server and React client with a single command:
   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## Project Structure

```text
Resolve-Desk/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Modals, Navbar, Sidebar, Cards
│   │   ├── pages/       # Dashboard, Login, Complaints, Profile
│   │   └── services/    # API calls
├── server/              # Express backend
│   ├── config/          # Database connection
│   ├── controllers/     # Auth, Complaints, User management
│   ├── middleware/      # JWT verification
│   ├── models/          # MongoDB schemas
│   └── routes/          # API endpoints
├── .env.example
├── package.json
└── README.md
```
