<div align="center">

# LedgerLeaf

### Pocket-Based Personal Finance Management System

**Smart records. Clear future.**

A modern full-stack finance management application developed as part of the **GoodStrings Inc. Technical Assessment**.

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

LedgerLeaf is a modern personal finance management application built around a **pocket-based budgeting system**. Instead of simply tracking expenses, the application encourages users to allocate funds into customizable pockets before spending, making budgeting more intentional and organized.

Users can manage their finances through budgeting, expense tracking, savings management, and real-time financial summaries, all within a responsive interface optimized for desktop and mobile devices.

This project was developed as part of the **GoodStrings Inc. Technical Assessment**, demonstrating full-stack web development using React, Laravel, TypeScript, and MySQL.

---

# Features

### Authentication

- User registration and login
- Secure authentication
- Session management
- Protected routes

### Dashboard

- Financial overview
- Safe Balance and Total Balance
- Recent transactions
- Budget health summary
- Spending statistics

### Pocket Management

- Create, edit, archive, and delete pockets
- Allocate available funds
- Monitor pocket balances
- Track remaining allocations

### Budget Planner

- Organize monthly budgets
- Allocate funds across pockets
- Reallocate budgets
- View allocation summaries

### Expense Management

- Record expenses by pocket
- Edit and delete transactions
- Archive expenses
- Filter transaction history

### Savings

- Deposit and withdraw savings
- Track savings progress
- Maintain savings history

### Profile

- Update account information
- Change password
- Export reports to PDF
- Export reports to Excel

---

# Core Concept

LedgerLeaf follows a proactive budgeting workflow.

```
Available Funds
        ↓
 Allocate to Pockets
        ↓
 Record Expenses
        ↓
 Update Balances
        ↓
 View Financial Insights
```

Instead of asking **"Where did my money go?"**, LedgerLeaf encourages users to decide **"Where should my money go?"** before spending.

---

# Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Laravel, PHP |
| Database | MySQL |
| Build Tools | Vite, npm, Composer |

---

# Project Highlights

This project demonstrates:

- Full CRUD operations
- RESTful API development
- Responsive web design
- Component-based architecture
- Authentication and authorization
- Relational database integration
- Form validation
- Financial data visualization
- PDF and Excel export generation
- Mobile-first development

---

# Project Structure

```text
LedgerLeaf/
├── backend/
├── frontend/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── assets/
├── README.md
└── ...
```

---

# Getting Started

## Clone

```bash
git clone https://github.com/Rachiminoff/LedgerLeaf.git
cd LedgerLeaf
```

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

---

# License

This repository was created for the **GoodStrings Inc. Technical Assessment** and is intended to demonstrate modern full-stack web development practices.

---

<div align="center">

**LedgerLeaf**

*Smart records. Clear future.*

Developed using React, Laravel, TypeScript, Tailwind CSS, and MySQL.

</div>