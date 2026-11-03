# FUTURE_FS_02
# CRM Lead Management System

A simple and responsive **CRM (Customer Relationship Management) Lead Management System** developed to manage customer leads, track follow-ups, monitor conversions, and organize business enquiries.

This project demonstrates how frontend, backend, and database technologies work together to create a functional web application.

## Project Overview

The CRM Lead Management System helps businesses manage their potential customers in one place.

Users can add new leads, update customer information, track follow-up dates, monitor lead status, and view important statistics through an interactive dashboard.

## Features

* **Dashboard:** View total leads, converted leads, pending follow-ups, and overdue follow-ups.
* **Add Leads:** Add new customer details.
* **View Leads:** Display all customer records in a table.
* **Update Leads:** Edit existing customer information.
* **Delete Leads:** Remove unwanted lead records.
* **Search Leads:** Find leads using names, email addresses, or company names.
* **Filter Leads:** Filter customers based on their status.
* **Follow-up Tracker:** Monitor upcoming and overdue follow-ups.
* **Conversion Rate:** Calculate the percentage of successfully converted leads.
* **Responsive Design:** Access the application on different screen sizes.

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* SQLite

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Web Browser

## Project Structure

```text
CRM-Lead-Management-System/
│
├── package.json
├── server.js
│
├── database/
│   └── database.db (created automatically)
│
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Installation and Setup

Follow these steps to run the project on your computer.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the Project

Open the downloaded project folder in Visual Studio Code.

### Step 3: Install Dependencies

Open the VS Code terminal and execute:

```bash
npm install
```

### Step 4: Start the Application

```bash
npm start
```

### Step 5: Open in Browser

Visit:

```text
http://localhost:3000
```

**Requirement:** Node.js version 22.13 or newer is required because the project uses Node.js built-in SQLite support.

## Application Modules

### 1. Dashboard

Displays important business information, including total leads, converted leads, pending follow-ups, overdue follow-ups, and conversion rate.

### 2. Lead Management

Allows users to create, view, edit, delete, search, and filter customer leads.

### 3. Follow-up Management

Helps users track upcoming and overdue customer follow-ups.

### 4. Database Management

Stores customer information using an SQLite database.

## API Endpoints

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| GET    | `/api/leads`      | Retrieve all leads            |
| POST   | `/api/leads`      | Add a new lead                |
| PUT    | `/api/leads/:id`  | Update a lead                 |
| DELETE | `/api/leads/:id`  | Delete a lead                 |
| GET    | `/api/dashboard`  | Retrieve dashboard statistics |
| GET    | `/api/follow-ups` | Retrieve follow-up records    |

## Sample Lead Statuses

* New
* Contacted
* Interested
* Converted
* Lost

## Screenshots

Add your project screenshots here after capturing them.

### Dashboard

![CRM Dashboard](screenshots/dashboard.png)

### All Leads

![All Leads](screenshots/all-leads.png)

### Follow-up Tracker

![Follow-up Tracker](screenshots/follow-ups.png)

## Learning Outcomes

Through this project, I gained practical experience in:

* Building responsive web interfaces.
* Developing backend applications using Node.js and Express.js.
* Connecting frontend applications with backend APIs.
* Performing CRUD operations.
* Working with SQLite databases.
* Managing customer information.
* Implementing search and filtering functionality.
* Understanding the flow of data from frontend to backend and database.

## Future Enhancements

* User authentication and login system.
* Role-based access control.
* Email reminders for follow-ups.
* Lead analytics and graphical reports.
* Export lead information to Excel or CSV.
* Cloud database integration.

## Disclaimer

This project uses fictional sample customer information for demonstration and testing purposes.

## Author

Developed as a Web Development Project to demonstrate practical skills in frontend development, backend development, and database management.

---

⭐ If you find this project useful, feel free to explore the repository!
