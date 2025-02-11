# 🏢 FDM StaffSync – Employee Portal Web App

FDM StaffSync is an **employee management and communication platform** designed for administrative efficiency and seamless interaction between employees, HR, and technicians. Built with **Next.js**, **Prisma**, and **PostgreSQL**, this project was developed as part of a **Software Engineering Project** at university.

🌍 **Live Demo:** [staff-sync-chi.vercel.app](https://staff-sync-chi.vercel.app)  

---

## 🚀 **Features**
- ✅ **User Authentication** – Secure login system using hashed passwords.
- 📢 **Announcements** – HR can post updates, and employees can view important company news.
- 📂 **HR Document Management** – Securely upload, manage, and view HR documents.
- 📅 **Leave Management** – Employees can request leave, and HR can approve or deny requests.
- 🎟 **Support Ticket System** – Employees can create tickets, and HR/technicians can respond.
- 👥 **Role-Based Access Control** – Different functionalities for Employees, HR, and Technicians.
- 📌 **User Management** – HR and technicians can add, remove, or edit users.
- 🔔 **Notifications & Alerts** – Employees get notified of company updates, approvals, and responses.

---

## 🛠 **Tech Stack**
| Technology     | Purpose |
|---------------|---------|
| **Next.js**   | Frontend & API Routes |
| **Prisma ORM**| Database interaction |
| **PostgreSQL**| Database |
| **Vercel**    | Deployment |
| **Neon.tech** | Cloud PostgreSQL |

---

## 📖 **Project Context**
FDM StaffSync was developed in response to the need for a **centralised, user-friendly** administrative system. The system allows HR specialists to focus on organisational tasks rather than repetitive admin work. Employees gain self-service access to critical documents, leave management, and communication tools, reducing administrative overhead.

This project was built with a **scalable** and **modern** architecture to allow future enhancements and feature additions.

---

## 👤 **Test User Accounts**
You can log in with the following credentials to explore different roles:

| Role         | Username  | Password  |
|-------------|----------|-----------|
| **Employee** | `employee1` | `password` |
| **Employee** | `employee2` | `password` |
| **HR**       | `hr`        | `password` |
| **HR**       | `hr2`       | `password` |
| **Technician** | `tech1`    | `password` |
| **Technician** | `tech2`    | `password` |

---

## 🏗 **Getting Started (Run Locally)**
This project is **already deployed** at [staff-sync-chi.vercel.app](https://staff-sync-chi.vercel.app), so running it locally is **optional**.

### 🔑 **Environment Variables**
To run this project locally, you need a `.env` file with the following variables:
```bash
DATABASE_URL="your_postgresql_connection_string" 
NEXTAUTH_SECRET="your_randomly_generated_secret"
NEXTAUTH_URL="http://localhost:3000"
```
⚠️ **Note:** The database is hosted on **Neon.tech**, so to run locally you will need to either:
1. **Set up your own PostgreSQL database** and replace `DATABASE_URL` with your own.
2. **Use a local SQLite database**.

---

### 1️⃣ **Install Dependencies**
```bash
npm install
```

### 2️⃣ **Set Up the Database**
Create a .env file with your local database credentials.

Then Run:
```bash
npx prisma migrate dev --name init
```

### 3️⃣ **Start the Development Server**
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Credits

Background Photo by [Nastuh Abootalebi](https://unsplash.com/@sunday_digital?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/photo-of-dining-table-and-chairs-inside-room-eHD8Y1Znfpk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

