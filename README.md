# Expense Tracker – Full-Stack Project (React + .NET Core)

A complete full-stack Expense Tracker application built using React (frontend) and ASP.NET Core Web API (backend) with JWT authentication, SQL Server database, and Recharts-based visual reports.
This project supports expense management, category/date filters, user authentication, and financial insights.

## 🚀 Features

## 🔐 Authentication

- User registration & login

- Secure JWT-based authentication

- Password hashing using BCrypt

## 🧾 Expense Management

- Add new expenses

- Edit existing expenses

- Delete expenses

- Automatic validation (Amount > 0, required inputs)

## 🔍 Expense Filtering

- Filter by category

- Filter by start & end date

- Combined filter logic for refined results

## 📊 Reports & Insights

- Category-wise spend distribution (Pie Chart)

- Month-wise expense totals (Bar Chart)

- Yearly summary with category totals

## 🗄 Backend Architecture (Clean Architecture Style)

- Controllers

- Services layer (Interfaces + Implementations)

- DTO layer

- EF Core DB Context

- SQL Server database

## 🧪 Testing

- Backend: xUnit + Moq 

- Frontend: Jest + React Testing Library

### Unit tests for:

- Add/Edit Expense pages

- AuthContext

- Service logic (Backend)

## 🛠 Tech Stack

- Front-End

- React (CRA)

- React Router DOM

- Axios

- Recharts

- Jest + React Testing Library

- Back-End

- ASP.NET Core Web API

- Entity Framework Core

- SQL Server

- JWT Authentication

- xUnit + Moq

## 📦 API Overview

### Authentication

- POST /api/auth/register – Register user

- POST /api/auth/login – Login & get JWT token

### Expenses

- POST /api/expenses – Add expense

- GET /api/expenses – Get all user expenses

- GET /api/expenses/{id} – Get single expense

- PUT /api/expenses/{id} – Update expense

- DELETE /api/expenses/{id} – Delete expense

- GET /api/expenses/filter – Filter expenses

## 🙌 Project Highlights

- Follows clean folder architecture

- Professional service abstraction using interfaces

- Implemented unit testing on both frontend & backend

- Provides interactive financial reports

- Secure and scalable for production-grade use

## 👤 Author

Hritam Bose
