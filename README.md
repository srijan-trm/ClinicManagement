# 🏥 Clinic Management System API

A full-stack RESTful API built with Node.js, Express, and PostgreSQL to manage the daily operations of a medical clinic. This system handles patient records, doctor directories, appointment scheduling, and a pharmacy inventory with prescription linking.

## ✨ Features

- **Patient Management:** Complete CRUD operations for patient records.
- **Doctor Directory:** Manage doctor profiles and specializations.
- **Appointment Scheduling:** Link patients and doctors to specific time slots.
- **Pharmacy Inventory:** Track medicine stock, pricing, and categories.
- **Prescriptions System:** A relational junction linking appointments to prescribed medicines.
- **Separation of Concerns:** Clean architecture utilizing separate Routes, Controllers, and Database Queries.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` node-postgres)
- **Frontend (Included):** HTML5, Vanilla JS, Tailwind CSS (Served statically via Express)

## 🗂️ Project Structure
```text
├── public/                 # Static frontend assets (dashboard.html)
├── routes/                 # Express route definitions
│   ├── patients.js
│   ├── doctors.js
│   ├── appointments.js
│   ├── medicines.js
│   └── prescriptions.js
├── controllers/            # Business logic and request handling
│   ├── patientController.js
│   ├── doctorController.js
│   └── ...
├── queries/                # Raw PostgreSQL queries
│   ├── patientQueries.js
│   ├── doctorQueries.js
│   └── ...
├── db.js                   # PostgreSQL connection pool setup
├── server.js               # Express application entry point
└── .env                    # Environment variables (DB credentials)