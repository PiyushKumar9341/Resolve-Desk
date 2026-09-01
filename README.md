# 🎓 Resolve Desk — Student Grievance & Complaint Portal

**Resolve Desk** is a modern, full-stack Web Application designed to streamline the student grievance and complaint resolution process in educational institutions. Built with the MERN stack (MongoDB, Express, React, Node.js), it enables students to log issues, track resolution progress in real-time, and provides administrators with tools to resolve grievances efficiently.

---

## ✨ Features

- 🔐 **Authentication & Security**
  - Secure JWT-based Authentication
  - OTP Email Verification using **Nodemailer**
  - Role-based Access Control (Student / Admin / Authority)
  
- 📝 **Complaint Management**
  - Submit new complaints with categories, title, and detailed descriptions
  - Real-time status tracking (Pending, In Progress, Resolved, Rejected)
  - View complaint history and detailed status logs

- 📊 **Dashboard & Analytics**
  - Interactive dashboard with stats cards (Total, Pending, Resolved Complaints)
  - Responsive sidebar navigation & modern UI powered by **Lucide React** icons

- ⚡ **Developer-Friendly Workflow**
  - Single-command dev startup using `concurrently` (runs server and Vite client together)
  - Pre-configured `.env.example` for seamless team collaboration

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Icons & UI:** Lucide React
- **HTTP Client:** Axios
- **Styling:** CSS3 (Flexbox/Grid, Responsive Layouts)

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Email Service:** Nodemailer (SMTP OTP verification)

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### 📋 Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Git**

---

### 💻 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PiyushKumar9341/Resolve-Desk.git
   cd Resolve-Desk
   ```

2. **Install Dependencies**
   Install root, server, and client dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Fill in your local environment parameters in `.env`:
   ```env
   # Server Configuration
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/student_grievance_db
   JWT_SECRET=your_super_secret_jwt_key_here

   # Email Credentials (Optional for Dev - OTP will log to console if blank)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password

   NODE_ENV=development
   ```

4. **Run the Application**
   Run both backend and frontend simultaneously with a single command:
   ```bash
   npm run dev
   ```
   - **Frontend:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000`

---

## 📁 Project Structure

```text
Resolve-Desk/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, StatsCard, ComplaintModal, etc.
│   │   ├── pages/           # Dashboard, MyComplaints, NewComplaint, Profile, Login
│   │   ├── services/        # Axios API client setup
│   │   ├── App.jsx          # Main App & Router
│   │   └── main.jsx         # React Entry Point
│   ├── index.html
│   └── package.json
│
├── server/                  # Node.js / Express Backend
│   ├── config/              # MongoDB connection setup
│   ├── controllers/         # Auth, Complaint, and User Controllers
│   ├── middleware/          # JWT Auth Middleware
│   ├── models/              # Mongoose Schemas (User, Complaint, Otp)
│   ├── routes/              # Express API Routes
│   ├── utils/               # Nodemailer & helper utilities
│   └── server.js            # Express Entry Point
│
├── .env.example             # Sample environment variables template
├── .gitignore               # Git ignored directories & files
├── package.json             # Root package.json (Concurrently setup)
└── README.md                # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! If you want to contribute to **Resolve Desk**:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

