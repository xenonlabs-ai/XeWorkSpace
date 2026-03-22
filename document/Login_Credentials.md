# XeTask - Login Credentials & Project Info

**Project:** XeTask - Team Management & Productivity Platform
**Document Created:** March 21, 2026

---

## Login Credentials

### Admin Account
| Field | Value |
|-------|-------|
| **Email** | admin@xetask.com |
| **Password** | admin123 |
| **Role** | ADMIN |
| **Access** | Full system access, user management, all features |

### Manager Account
| Field | Value |
|-------|-------|
| **Email** | manager@xetask.com |
| **Password** | manager123 |
| **Role** | MANAGER |
| **Name** | Sarah Johnson |
| **Access** | Team management, performance reviews, reports |

### Team Member Accounts

| Name | Email | Password | Department | Role |
|------|-------|----------|------------|------|
| Alex Johnson | alex.johnson@xetask.com | member123 | Engineering | Senior Developer |
| Samantha Lee | samantha.lee@xetask.com | member123 | Design | UI/UX Designer |
| Michael Chen | michael.chen@xetask.com | member123 | Engineering | Full Stack Developer |
| Emily Rodriguez | emily.rodriguez@xetask.com | member123 | Marketing | Marketing Specialist |
| David Kim | david.kim@xetask.com | member123 | Design | Product Designer |

---

## Quick Access URLs

| Page | URL |
|------|-----|
| Login | http://localhost:3000/auth/login |
| Register | http://localhost:3000/auth/register |
| Dashboard | http://localhost:3000 |
| Tasks | http://localhost:3000/tasks |
| Members | http://localhost:3000/members |
| Attendance | http://localhost:3000/attendance |
| Performance | http://localhost:3000/performance |
| Reports | http://localhost:3000/reports |

---

## API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/[...nextauth] - NextAuth endpoints
```

### Users
```
GET    /api/users           - List all users
POST   /api/users           - Create user (Admin)
GET    /api/users/:id       - Get user details
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user (Admin)
```

### Tasks
```
GET    /api/tasks           - List all tasks
POST   /api/tasks           - Create task
GET    /api/tasks/:id       - Get task details
PUT    /api/tasks/:id       - Update task
DELETE /api/tasks/:id       - Delete task
```

### Attendance
```
GET    /api/attendance      - List attendance records
POST   /api/attendance      - Create attendance record
POST   /api/attendance/check-in  - Quick check-in
POST   /api/attendance/check-out - Quick check-out
```

### Performance Reviews
```
GET    /api/performance/reviews      - List reviews
POST   /api/performance/reviews      - Create review (Manager+)
GET    /api/performance/reviews/:id  - Get review details
PUT    /api/performance/reviews/:id  - Update review
DELETE /api/performance/reviews/:id  - Delete review (Admin)
```

### Teams & Projects
```
GET    /api/teams           - List teams
POST   /api/teams           - Create team
GET    /api/projects        - List projects
POST   /api/projects        - Create project
```

---

## Database Commands

```bash
# Start development server
npm run dev

# Seed database with sample data
npm run db:seed

# Reset database (deletes all data)
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio

# Run migrations
npx prisma migrate dev
```

---

## Project Naming Suggestions

### Recommended: **XeTask**
- Clean, modern, matches folder name
- "Xe" prefix aligns with Xenonlabs.ai branding
- Professional and memorable

### Alternatives:
| Name | Description |
|------|-------------|
| **XeTask Pro** | Premium/professional variant |
| **XeFlow** | Emphasizes workflow management |
| **XeTeam** | Focus on team collaboration |
| **XeWork** | Workplace productivity focus |
| **XeSync** | Emphasizes synchronization/coordination |
| **XeHub** | Central hub for team activities |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | SQLite (Prisma ORM) |
| Authentication | NextAuth.js |
| UI Components | shadcn/ui, Radix UI |

---

*This document contains sensitive credentials. Do not share publicly.*
