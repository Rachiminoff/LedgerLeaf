<div align="center">

# LedgerLeaf

### Pocket-Based Personal Finance Management System

**Smart records. Clear future.**

A modern full-stack web application for budgeting, expense tracking, savings management, and financial analytics. Developed as part of the **GoodStrings Inc. Technical Assessment**.

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

# About

LedgerLeaf is a modern **full-stack personal finance management system** built around a **pocket-based budgeting philosophy**. Rather than simply tracking expenses after they happen, LedgerLeaf encourages users to plan ahead by assigning every peso a purpose before spending.

The application combines budgeting, pocket management, expense tracking, savings goals, financial analytics, and reporting into a single responsive platform optimized for both desktop and mobile devices.

LedgerLeaf represents the evolution of an earlier mobile budgeting concept into a more complete web application featuring a Laravel backend, relational database, RESTful APIs, and a modern React interface.

---

# Core Philosophy

Traditional expense trackers answer:

> **"Where did my money go?"**

LedgerLeaf encourages users to ask:

> **"Where should my money go before I spend it?"**

Money first enters your **Total Balance**, then becomes available as **Safe Balance**, allowing you to intentionally allocate funds into budgeting pockets or savings before recording expenses.

```
Income
    │
    ▼
Total Balance
    │
    ▼
Safe Balance
    │
    ├──────────────┐
    ▼              ▼
Budget Pockets   Savings Goals
    │
    ▼
Expenses
    │
    ▼
Analytics & Insights
```

This workflow promotes mindful spending, organized budgeting, and healthier financial habits.

---

# Features

## Authentication

- Secure user registration and login
- Session management
- Protected routes
- Password validation

## Dashboard

- Financial overview
- Safe Balance and Total Balance
- Pocket summaries
- Recent transactions
- Budget health
- Quick actions

## Pocket Management

- Create, update, archive, and delete pockets
- Allocate available funds
- Monitor pocket balances
- Organize spending categories

## Budget Planner

- Plan monthly budgets
- Allocate disposable income
- Reallocate pocket budgets
- Budget utilization overview

## Expense Management

- Record expenses by pocket
- Edit and archive transactions
- Transaction history
- Category filtering
- Search functionality

## Savings

- Create savings goals
- Deposit and withdraw savings
- Progress tracking
- Safe Balance validation
- Savings history

## Analytics

- Spending trends
- Pocket breakdown
- Monthly comparisons
- Savings performance
- Financial insights
- Exportable reports

## Profile

- Update account information
- Change password
- Export reports (PDF / Excel)
- View account statistics

## Help Center

- About LedgerLeaf
- Getting Started guide
- Financial concepts
- Frequently Asked Questions
- Application information

---

# Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React 19, TypeScript, Tailwind CSS, Inertia.js |
| Backend | Laravel 12, PHP |
| Database | MySQL |
| Build Tools | Vite, Composer, npm |

---

# Project Highlights

LedgerLeaf demonstrates modern full-stack web development through:

- Full CRUD operations
- RESTful API integration
- Authentication & Authorization
- Responsive UI/UX
- Mobile-first development
- Component-based architecture
- Financial data visualization
- Real-time dashboard summaries
- PDF and Excel export generation
- Relational database design
- Form validation
- JSON-driven help documentation

---

# Project Structure

```text
LedgerLeaf/
│
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   ├── Hooks/
│   │   ├── Services/
│   │   ├── Types/
│   │   └── Utils/
│   │
│   ├── data/
│   │   └── help/
│   │
│   └── views/
│
├── routes/
├── storage/
├── README.md
└── ...
```

---

# System Architecture

LedgerLeaf follows a modern full-stack monolithic architecture that combines a Laravel backend with a React-based frontend through Inertia.js.

The application is structured within a single Laravel project while providing a modern single-page application experience through React components and Inertia-powered navigation.

## Frontend Layer

The frontend layer is developed using React 19, TypeScript, Tailwind CSS, and Inertia.js.

It is responsible for:

- Building reusable UI components
- Managing user interactions
- Rendering dashboards and financial visualizations
- Handling forms and client-side state
- Providing a responsive interface optimized for desktop and mobile devices

Inertia.js serves as the bridge between Laravel and React, allowing the application to use React components while maintaining Laravel's routing and server-side capabilities without requiring a separate API layer.

## Backend Layer

The backend is powered by Laravel 12 and PHP 8.4.

It handles:

- Application routing
- Authentication and authorization
- Business logic and financial calculations
- Data validation
- Report generation
- Database operations using Laravel's ORM

The backend manages the application's core features, including budgeting, pocket allocation, expense tracking, savings management, and analytics processing.

## Database Layer

LedgerLeaf uses MySQL as its relational database management system.

The database stores and manages:

- User accounts
- Budget pockets
- Expenses and transactions
- Savings goals
- Financial records
- Application settings

The relational database structure ensures consistency between users, budgets, expenses, and savings data.

## Deployment Architecture

LedgerLeaf is deployed using cloud-based services:

- Render hosts the Laravel application, React frontend, and compiled assets.
- Railway provides the managed MySQL database.

This separation allows the application layer and database layer to be managed independently while maintaining a reliable connection between services.

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/Rachiminoff/LedgerLeaf.git

cd LedgerLeaf
```

---

## Install Dependencies

```bash
npm install

composer install
```

---

## Configure Environment

```bash
cp .env.example .env

php artisan key:generate
```

Configure your database credentials inside `.env`.

---

## Run Database Migrations

```bash
php artisan migrate
```

(Optional)

```bash
php artisan db:seed
```

---

## Start Development Servers

Laravel

```bash
php artisan serve
```

Vite

```bash
npm run dev
```

---

# Future Improvements

Planned enhancements include:

- Email verification
- Password recovery
- Budget templates
- Smart budgeting recommendations
- Receipt uploads
- Recurring transactions
- Notifications
- Data backups
- Multi-currency support
- Dark / Light theme customization

---

# License

This project was developed as part of the **GoodStrings Inc. Technical Assessment** and is intended to demonstrate modern full-stack web development practices using Laravel, React, TypeScript, and MySQL.

---

<div align="center">

## LedgerLeaf

**Smart records. Clear future.**

Pocket-Based Personal Finance Management System

Built with **Laravel**, **React**, **TypeScript**, **Tailwind CSS**, and **MySQL**.

</div>