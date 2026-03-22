# XeTask

A modern team management and productivity platform built with Next.js, React, and SQLite.

## Features

- User authentication with NextAuth.js
- Task management with assignments and priorities
- Team member management
- Attendance tracking with check-in/check-out
- Performance reviews for employees
- Dashboard with analytics
- Responsive design with dark/light theme

## Getting Started

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@xetask.com | admin123 |
| Manager | manager@xetask.com | manager123 |
| Member | alex.johnson@xetask.com | member123 |

## Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19, Tailwind CSS, shadcn/ui
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
