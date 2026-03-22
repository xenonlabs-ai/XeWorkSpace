# XeTask - Detailed Implementation Plan

**Project:** XeTask - Team Management & Task Collaboration Platform
**Document:** Implementation Plan for Missing Features
**Created:** March 21, 2026
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Database Implementation](#2-database-implementation)
3. [API Development](#3-api-development)
4. [Individual Employee Performance Review System](#4-individual-employee-performance-review-system)
5. [Live Employee Desktop Monitoring](#5-live-employee-desktop-monitoring)
6. [Implementation Timeline](#6-implementation-timeline)
7. [Technical Requirements](#7-technical-requirements)

---

## 1. Executive Summary

This document outlines the detailed implementation plan for four major features identified as missing or required in the XeTask application:

| Feature | Priority | Complexity | Estimated Effort |
|---------|----------|------------|------------------|
| Database Integration | Critical | Medium | Phase 1 |
| API Development | Critical | Medium | Phase 1 |
| Employee Performance Review | High | Medium | Phase 2 |
| Live Desktop Monitoring | High | High | Phase 3 |

### Current State
- Frontend-only UI template
- No database connectivity
- No API endpoints
- Mock/static data in components
- No real-time features

### Target State
- Full-stack application with PostgreSQL database
- RESTful API with Next.js API routes
- Complete performance review workflow
- Real-time employee desktop monitoring

---

## 2. Database Implementation

### 2.1 Technology Selection

| Component | Technology | Justification |
|-----------|------------|---------------|
| Database | PostgreSQL | Robust, scalable, excellent for relational data |
| ORM | Prisma | Type-safe, excellent Next.js integration |
| Hosting | Supabase / Neon / AWS RDS | Managed PostgreSQL services |

### 2.2 Installation & Setup

#### Step 1: Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

#### Step 2: Initialize Prisma

```bash
npx prisma init
```

#### Step 3: Configure Environment

Create/update `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskify?schema=public"
```

### 2.3 Database Schema Design

#### File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER & AUTHENTICATION ====================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String
  firstName         String
  lastName          String
  avatar            String?
  phone             String?
  location          String?
  role              UserRole  @default(MEMBER)
  status            UserStatus @default(ACTIVE)
  department        String?
  jobTitle          String?
  skills            String[]
  joinedAt          DateTime  @default(now())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  assignedTasks     Task[]    @relation("AssignedTasks")
  createdTasks      Task[]    @relation("CreatedTasks")
  attendance        Attendance[]
  performanceReviews PerformanceReview[] @relation("ReviewedEmployee")
  conductedReviews  PerformanceReview[] @relation("Reviewer")
  goals             Goal[]
  sentMessages      Message[] @relation("SentMessages")
  receivedMessages  Message[] @relation("ReceivedMessages")
  desktopSessions   DesktopSession[]
  notifications     Notification[]
  teamMemberships   TeamMember[]
}

enum UserRole {
  ADMIN
  MANAGER
  MEMBER
  VIEWER
}

enum UserStatus {
  ACTIVE
  AWAY
  OFFLINE
  ON_LEAVE
}

// ==================== TEAMS ====================

model Team {
  id          String    @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  members     TeamMember[]
  projects    Project[]
}

model TeamMember {
  id        String   @id @default(cuid())
  userId    String
  teamId    String
  role      String   @default("member")
  joinedAt  DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([userId, teamId])
}

// ==================== PROJECTS ====================

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNING)
  priority    Priority      @default(MEDIUM)
  startDate   DateTime?
  endDate     DateTime?
  progress    Int           @default(0)
  teamId      String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  team        Team?         @relation(fields: [teamId], references: [id])
  tasks       Task[]
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

// ==================== TASKS ====================

model Task {
  id          String      @id @default(cuid())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  priority    Priority    @default(MEDIUM)
  category    String?
  dueDate     DateTime?
  completedAt DateTime?
  estimatedHours Float?
  actualHours    Float?
  projectId   String?
  assigneeId  String?
  creatorId   String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  project     Project?    @relation(fields: [projectId], references: [id])
  assignee    User?       @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creator     User        @relation("CreatedTasks", fields: [creatorId], references: [id])
  comments    TaskComment[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model TaskComment {
  id        String   @id @default(cuid())
  content   String
  taskId    String
  authorId  String
  createdAt DateTime @default(now())

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}

// ==================== ATTENDANCE ====================

model Attendance {
  id          String           @id @default(cuid())
  userId      String
  date        DateTime         @db.Date
  checkIn     DateTime?
  checkOut    DateTime?
  status      AttendanceStatus @default(PRESENT)
  workType    WorkType         @default(OFFICE)
  hoursWorked Float?
  notes       String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  ON_LEAVE
}

enum WorkType {
  OFFICE
  REMOTE
  HYBRID
}

// ==================== PERFORMANCE REVIEW ====================

model PerformanceReview {
  id              String       @id @default(cuid())
  employeeId      String
  reviewerId      String
  reviewPeriod    String       // e.g., "Q1 2026", "Annual 2025"
  reviewType      ReviewType   @default(QUARTERLY)
  status          ReviewStatus @default(DRAFT)

  // Ratings (1-5 scale)
  productivityRating    Int?
  qualityRating         Int?
  communicationRating   Int?
  teamworkRating        Int?
  initiativeRating      Int?
  punctualityRating     Int?
  technicalSkillsRating Int?
  overallRating         Float?

  // Feedback
  strengths             String?
  areasForImprovement   String?
  managerComments       String?
  employeeSelfAssessment String?
  goalsForNextPeriod    String?

  // Timestamps
  scheduledDate   DateTime?
  submittedAt     DateTime?
  acknowledgedAt  DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  employee        User         @relation("ReviewedEmployee", fields: [employeeId], references: [id])
  reviewer        User         @relation("Reviewer", fields: [reviewerId], references: [id])
  goals           Goal[]
  feedbacks       PerformanceFeedback[]
}

enum ReviewType {
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
  ANNUAL
  PROBATION
  PROJECT_BASED
}

enum ReviewStatus {
  DRAFT
  SELF_ASSESSMENT_PENDING
  MANAGER_REVIEW_PENDING
  COMPLETED
  ACKNOWLEDGED
}

model PerformanceFeedback {
  id          String   @id @default(cuid())
  reviewId    String
  providerId  String   // Who gave the feedback
  relationship String  // "peer", "manager", "direct_report"
  rating      Int?
  comments    String?
  anonymous   Boolean  @default(false)
  createdAt   DateTime @default(now())

  review      PerformanceReview @relation(fields: [reviewId], references: [id], onDelete: Cascade)
}

model Goal {
  id          String     @id @default(cuid())
  userId      String
  reviewId    String?
  title       String
  description String?
  targetDate  DateTime?
  progress    Int        @default(0)
  status      GoalStatus @default(NOT_STARTED)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user        User       @relation(fields: [userId], references: [id])
  review      PerformanceReview? @relation(fields: [reviewId], references: [id])
}

enum GoalStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// ==================== MESSAGES ====================

model Message {
  id          String   @id @default(cuid())
  content     String
  senderId    String
  receiverId  String
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())

  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
}

// ==================== DESKTOP MONITORING ====================

model DesktopSession {
  id          String        @id @default(cuid())
  userId      String
  deviceName  String
  deviceId    String        @unique
  ipAddress   String?
  status      SessionStatus @default(OFFLINE)
  lastActive  DateTime      @default(now())
  startedAt   DateTime      @default(now())
  endedAt     DateTime?

  user        User          @relation(fields: [userId], references: [id])
  screenshots Screenshot[]
  activityLogs ActivityLog[]
}

enum SessionStatus {
  ONLINE
  OFFLINE
  IDLE
  STREAMING
}

model Screenshot {
  id          String   @id @default(cuid())
  sessionId   String
  imageUrl    String
  thumbnailUrl String?
  capturedAt  DateTime @default(now())

  session     DesktopSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

model ActivityLog {
  id          String   @id @default(cuid())
  sessionId   String
  activityType String  // "app_switch", "idle_start", "idle_end", etc.
  appName     String?
  windowTitle String?
  duration    Int?     // in seconds
  createdAt   DateTime @default(now())

  session     DesktopSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id          String   @id @default(cuid())
  userId      String
  title       String
  message     String
  type        String   // "task", "review", "message", "system"
  read        Boolean  @default(false)
  actionUrl   String?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ==================== CALENDAR EVENTS ====================

model CalendarEvent {
  id          String    @id @default(cuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  allDay      Boolean   @default(false)
  location    String?
  type        String    // "meeting", "deadline", "reminder", etc.
  creatorId   String
  attendees   String[]  // Array of user IDs
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ==================== REPORTS ====================

model Report {
  id          String   @id @default(cuid())
  name        String
  type        String   // "performance", "attendance", "tasks", "custom"
  parameters  Json?    // Filter parameters
  schedule    String?  // Cron expression for scheduled reports
  lastRunAt   DateTime?
  creatorId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2.4 Database Migration Commands

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio
```

### 2.5 Database Client Setup

#### File: `lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

---

## 3. API Development

### 3.1 API Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── logout/route.ts
│   │   ├── forgot-password/route.ts
│   │   └── reset-password/route.ts
│   │
│   ├── users/
│   │   ├── route.ts                 # GET all, POST create
│   │   ├── [id]/route.ts            # GET, PUT, DELETE single user
│   │   └── [id]/performance/route.ts
│   │
│   ├── teams/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── [id]/members/route.ts
│   │
│   ├── projects/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── [id]/tasks/route.ts
│   │
│   ├── tasks/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── [id]/comments/route.ts
│   │
│   ├── attendance/
│   │   ├── route.ts
│   │   ├── check-in/route.ts
│   │   ├── check-out/route.ts
│   │   └── [userId]/route.ts
│   │
│   ├── performance/
│   │   ├── reviews/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   ├── [id]/submit/route.ts
│   │   │   └── [id]/acknowledge/route.ts
│   │   ├── goals/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── feedback/route.ts
│   │
│   ├── messages/
│   │   ├── route.ts
│   │   └── [conversationId]/route.ts
│   │
│   ├── monitoring/
│   │   ├── sessions/route.ts
│   │   ├── sessions/[id]/route.ts
│   │   ├── screenshots/route.ts
│   │   └── stream/route.ts          # WebSocket endpoint
│   │
│   ├── calendar/
│   │   ├── events/route.ts
│   │   └── events/[id]/route.ts
│   │
│   ├── reports/
│   │   ├── route.ts
│   │   ├── generate/route.ts
│   │   └── [id]/route.ts
│   │
│   └── notifications/
│       ├── route.ts
│       └── mark-read/route.ts
```

### 3.2 Authentication Setup

#### Install NextAuth.js

```bash
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

#### File: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };
```

### 3.3 Sample API Endpoints

#### File: `app/api/users/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where = {
      ...(role && { role: role as any }),
      ...(status && { status: status as any }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          status: true,
          department: true,
          jobTitle: true,
          joinedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, firstName, lastName, role, department, jobTitle } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "MEMBER",
        department,
        jobTitle,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### File: `app/api/tasks/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assigneeId = searchParams.get("assigneeId");
    const projectId = searchParams.get("projectId");

    const where = {
      ...(status && { status: status as any }),
      ...(priority && { priority: priority as any }),
      ...(assigneeId && { assigneeId }),
      ...(projectId && { projectId }),
    };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate, assigneeId, projectId, category } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
        projectId,
        category,
        creatorId: session.user.id,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 3.4 API Middleware

#### File: `middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith("/api/users") && req.method === "DELETE") {
      if (token?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Manager+ routes for performance reviews
    if (path.startsWith("/api/performance/reviews") && req.method === "POST") {
      if (!["ADMIN", "MANAGER"].includes(token?.role as string)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*"],
};
```

---

## 4. Individual Employee Performance Review System

### 4.1 Feature Overview

| Component | Description |
|-----------|-------------|
| Review Creation | Managers create reviews for employees |
| Self-Assessment | Employees submit self-assessments |
| 360 Feedback | Peers provide anonymous feedback |
| Goal Setting | Set and track individual goals |
| Review History | View past reviews and progress |
| Acknowledgment | Employees acknowledge completed reviews |

### 4.2 UI Components Structure

```
components/
├── performance/
│   ├── reviews/
│   │   ├── review-list.tsx           # List all reviews
│   │   ├── review-card.tsx           # Individual review card
│   │   ├── review-detail.tsx         # Detailed review view
│   │   ├── review-form.tsx           # Create/edit review form
│   │   ├── self-assessment-form.tsx  # Employee self-assessment
│   │   ├── feedback-form.tsx         # 360 feedback form
│   │   ├── rating-input.tsx          # Star/number rating component
│   │   └── review-timeline.tsx       # Review history timeline
│   │
│   ├── goals/
│   │   ├── goal-list.tsx
│   │   ├── goal-card.tsx
│   │   ├── goal-form.tsx
│   │   └── goal-progress.tsx
│   │
│   └── employee/
│       ├── employee-performance-profile.tsx
│       ├── performance-summary.tsx
│       └── performance-chart.tsx
```

### 4.3 Component Implementations

#### File: `components/performance/reviews/review-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

const reviewSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  reviewPeriod: z.string().min(1, "Review period is required"),
  reviewType: z.enum(["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "PROBATION"]),
  productivityRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  teamworkRating: z.number().min(1).max(5),
  initiativeRating: z.number().min(1).max(5),
  punctualityRating: z.number().min(1).max(5),
  technicalSkillsRating: z.number().min(1).max(5),
  strengths: z.string().optional(),
  areasForImprovement: z.string().optional(),
  managerComments: z.string().optional(),
  goalsForNextPeriod: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface ReviewFormProps {
  employees: Employee[];
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onSaveDraft: (data: ReviewFormData) => Promise<void>;
}

export function ReviewForm({ employees, onSubmit, onSaveDraft }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productivityRating: 3,
      qualityRating: 3,
      communicationRating: 3,
      teamworkRating: 3,
      initiativeRating: 3,
      punctualityRating: 3,
      technicalSkillsRating: 3,
    },
  });

  const ratingCategories = [
    { name: "productivityRating", label: "Productivity", description: "Task completion and efficiency" },
    { name: "qualityRating", label: "Quality of Work", description: "Accuracy and attention to detail" },
    { name: "communicationRating", label: "Communication", description: "Written and verbal communication" },
    { name: "teamworkRating", label: "Teamwork", description: "Collaboration with team members" },
    { name: "initiativeRating", label: "Initiative", description: "Self-motivation and proactivity" },
    { name: "punctualityRating", label: "Punctuality", description: "Timeliness and attendance" },
    { name: "technicalSkillsRating", label: "Technical Skills", description: "Job-specific competencies" },
  ];

  const handleSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Performance Review Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Selection */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select onValueChange={(v) => form.setValue("employeeId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Review Period</Label>
              <Input
                placeholder="e.g., Q1 2026"
                {...form.register("reviewPeriod")}
              />
            </div>

            <div className="space-y-2">
              <Label>Review Type</Label>
              <Select onValueChange={(v) => form.setValue("reviewType", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="SEMI_ANNUAL">Semi-Annual</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                  <SelectItem value="PROBATION">Probation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Ratings</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {ratingCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{category.label}</Label>
                    <span className="text-xs text-muted-foreground">
                      {category.description}
                    </span>
                  </div>
                  <RatingStars
                    value={form.watch(category.name as any) || 3}
                    onChange={(v) => form.setValue(category.name as any, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Feedback & Comments</h3>

            <div className="space-y-2">
              <Label>Strengths</Label>
              <Textarea
                placeholder="Highlight the employee's key strengths..."
                rows={3}
                {...form.register("strengths")}
              />
            </div>

            <div className="space-y-2">
              <Label>Areas for Improvement</Label>
              <Textarea
                placeholder="Identify areas where the employee can improve..."
                rows={3}
                {...form.register("areasForImprovement")}
              />
            </div>

            <div className="space-y-2">
              <Label>Manager Comments</Label>
              <Textarea
                placeholder="Additional comments or observations..."
                rows={3}
                {...form.register("managerComments")}
              />
            </div>

            <div className="space-y-2">
              <Label>Goals for Next Period</Label>
              <Textarea
                placeholder="Set specific, measurable goals..."
                rows={3}
                {...form.register("goalsForNextPeriod")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSaveDraft(form.getValues())}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
```

#### File: `components/performance/reviews/self-assessment-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SelfAssessmentFormProps {
  reviewId: string;
  reviewPeriod: string;
  onSubmit: (data: any) => Promise<void>;
}

export function SelfAssessmentForm({ reviewId, reviewPeriod, onSubmit }: SelfAssessmentFormProps) {
  const [ratings, setRatings] = useState({
    productivity: 3,
    quality: 3,
    communication: 3,
    teamwork: 3,
    initiative: 3,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        reviewId,
        ratings,
        ...data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const assessmentQuestions = [
    {
      id: "accomplishments",
      label: "Key Accomplishments",
      placeholder: "List your major accomplishments during this review period...",
    },
    {
      id: "challenges",
      label: "Challenges Faced",
      placeholder: "Describe any challenges you encountered and how you addressed them...",
    },
    {
      id: "learnings",
      label: "Skills Developed",
      placeholder: "What new skills or knowledge did you acquire?",
    },
    {
      id: "goals",
      label: "Goals for Next Period",
      placeholder: "What goals would you like to set for the next review period?",
    },
    {
      id: "support",
      label: "Support Needed",
      placeholder: "What resources or support do you need to achieve your goals?",
    },
    {
      id: "feedback",
      label: "Feedback for Management",
      placeholder: "Any feedback or suggestions for your manager or the team?",
    },
  ];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Self-Assessment</CardTitle>
          <CardDescription>
            Review Period: {reviewPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Self Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rate Your Performance</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="capitalize">{key}</Label>
                    <span className="text-sm font-medium">{value}/5</span>
                  </div>
                  <Slider
                    value={[value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={([v]) => setRatings({ ...ratings, [key]: v })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Self-Reflection</h3>
            {assessmentQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label>{question.label}</Label>
                <Textarea
                  placeholder={question.placeholder}
                  rows={4}
                  {...form.register(question.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Self-Assessment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
```

#### File: `components/performance/employee/employee-performance-profile.tsx`

```typescript
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Star, TrendingUp, Target, Calendar } from "lucide-react";

interface PerformanceData {
  period: string;
  productivity: number;
  quality: number;
  overall: number;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
}

interface Review {
  id: string;
  period: string;
  type: string;
  overallRating: number;
  status: string;
  date: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  jobTitle: string;
  department: string;
  joinedAt: string;
}

interface EmployeePerformanceProfileProps {
  employee: Employee;
  performanceHistory: PerformanceData[];
  goals: Goal[];
  reviews: Review[];
  currentMetrics: {
    productivity: number;
    quality: number;
    attendance: number;
    taskCompletion: number;
  };
}

export function EmployeePerformanceProfile({
  employee,
  performanceHistory,
  goals,
  reviews,
  currentMetrics,
}: EmployeePerformanceProfileProps) {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback>
                {employee.firstName[0]}{employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground">{employee.jobTitle}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{employee.department}</Badge>
                <Badge variant="secondary">
                  Joined {new Date(employee.joinedAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{averageRating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(currentMetrics).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-2xl font-bold">{value}%</span>
              </div>
              <Progress value={value} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Goals ({goals.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            Review History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#3b82f6"
                      name="Productivity"
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#22c55e"
                      name="Quality"
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#f59e0b"
                      name="Overall"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goals & Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          goal.status === "COMPLETED"
                            ? "default"
                            : goal.status === "IN_PROGRESS"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {goal.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="flex-1" />
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{review.period}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.type} Review • {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.overallRating}/5</span>
                      </div>
                      <Badge
                        variant={
                          review.status === "ACKNOWLEDGED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {review.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4.4 Performance Review API Endpoints

#### File: `app/api/performance/reviews/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET /api/performance/reviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const reviewType = searchParams.get("type");

    // If not admin/manager, only show own reviews
    const where: any = {};
    if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
      where.employeeId = session.user.id;
    } else if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) where.status = status;
    if (reviewType) where.reviewType = reviewType;

    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            jobTitle: true,
            department: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        goals: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/performance/reviews
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      reviewPeriod,
      reviewType,
      scheduledDate,
      ...ratings
    } = body;

    // Calculate overall rating
    const ratingFields = [
      "productivityRating",
      "qualityRating",
      "communicationRating",
      "teamworkRating",
      "initiativeRating",
      "punctualityRating",
      "technicalSkillsRating",
    ];

    const validRatings = ratingFields
      .map((f) => ratings[f])
      .filter((r) => r !== undefined && r !== null);

    const overallRating = validRatings.length > 0
      ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length
      : null;

    const review = await prisma.performanceReview.create({
      data: {
        employeeId,
        reviewerId: session.user.id,
        reviewPeriod,
        reviewType,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        overallRating,
        status: "SELF_ASSESSMENT_PENDING",
        ...ratings,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notification for employee
    await prisma.notification.create({
      data: {
        userId: employeeId,
        title: "New Performance Review",
        message: `A ${reviewType.toLowerCase()} performance review for ${reviewPeriod} has been initiated. Please complete your self-assessment.`,
        type: "review",
        actionUrl: `/performance/reviews/${review.id}/self-assessment`,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 4.5 New Pages Required

```
app/
├── performance/
│   ├── page.tsx                    # Existing - enhance with review list
│   ├── reviews/
│   │   ├── page.tsx                # All reviews list
│   │   ├── new/page.tsx            # Create new review
│   │   └── [id]/
│   │       ├── page.tsx            # Review detail
│   │       ├── edit/page.tsx       # Edit review
│   │       └── self-assessment/page.tsx
│   │
│   ├── goals/
│   │   ├── page.tsx                # Goals list
│   │   └── [id]/page.tsx           # Goal detail
│   │
│   └── employees/
│       └── [id]/page.tsx           # Employee performance profile
```

---

## 5. Live Employee Desktop Monitoring

### 5.1 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │  Employee   │     │   LiveKit   │     │    XeTask      │    │
│  │  Desktop    │────▶│   Server    │────▶│   Dashboard     │    │
│  │  Agent      │     │   (SFU)     │     │   (Viewer)      │    │
│  └─────────────┘     └─────────────┘     └─────────────────┘    │
│       │                    │                     │               │
│       │                    │                     │               │
│       ▼                    ▼                     ▼               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │  Screen     │     │  WebSocket  │     │  React          │    │
│  │  Capture    │     │  Signaling  │     │  Components     │    │
│  └─────────────┘     └─────────────┘     └─────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Desktop Agent | Electron | Screen capture & streaming |
| Media Server | LiveKit (Self-hosted) | WebRTC SFU |
| Backend | Next.js API | Session management |
| Storage | AWS S3 / Cloudinary | Screenshot storage |
| Real-time | Socket.io | Status updates |

### 5.3 Installation Requirements

```bash
# XeTask Dashboard Dependencies
npm install livekit-client @livekit/components-react livekit-server-sdk socket.io-client

# Employee Agent (separate Electron project)
npm install electron electron-builder
npm install livekit-client screenshot-desktop
```

### 5.4 Employee Desktop Agent

#### Project Structure

```
employee-agent/
├── package.json
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Preload script
│   ├── tray.ts              # System tray
│   └── capture.ts           # Screen capture logic
├── src/
│   ├── App.tsx              # Agent UI
│   ├── services/
│   │   ├── livekit.ts       # LiveKit connection
│   │   ├── api.ts           # Backend API calls
│   │   └── activity.ts      # Activity tracking
│   └── components/
│       ├── StatusIndicator.tsx
│       └── Settings.tsx
└── assets/
    └── icon.png
```

#### File: `employee-agent/electron/main.ts`

```typescript
import { app, BrowserWindow, Tray, Menu, desktopCapturer, ipcMain } from "electron";
import path from "path";
import { Room, RoomEvent, VideoPresets, LocalVideoTrack } from "livekit-client";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let room: Room | null = null;
let isStreaming = false;

// Configuration
const CONFIG = {
  serverUrl: process.env.TASKIFY_API_URL || "http://localhost:3000",
  livekitUrl: process.env.LIVEKIT_URL || "ws://localhost:7880",
  deviceId: getDeviceId(),
};

function getDeviceId(): string {
  // Generate or retrieve unique device ID
  const machineId = require("node-machine-id").machineIdSync();
  return machineId;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
}

function createTray() {
  tray = new Tray(path.join(__dirname, "../assets/icon.png"));

  const updateTrayMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: isStreaming ? "🔴 Streaming Active" : "⚪ Not Streaming",
        enabled: false,
      },
      { type: "separator" },
      {
        label: isStreaming ? "Stop Streaming" : "Start Streaming",
        click: () => {
          if (isStreaming) {
            stopStreaming();
          } else {
            startStreaming();
          }
        },
      },
      { type: "separator" },
      {
        label: "Settings",
        click: () => mainWindow?.show(),
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          stopStreaming();
          app.quit();
        },
      },
    ]);

    tray?.setContextMenu(contextMenu);
    tray?.setToolTip(isStreaming ? "XeTask Agent - Streaming" : "XeTask Agent");
  };

  updateTrayMenu();
  return updateTrayMenu;
}

async function startStreaming() {
  try {
    // Get authentication token from server
    const response = await fetch(`${CONFIG.serverUrl}/api/monitoring/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: CONFIG.deviceId,
        deviceName: require("os").hostname(),
      }),
    });

    const { token, sessionId } = await response.json();

    // Connect to LiveKit room
    room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    await room.connect(CONFIG.livekitUrl, token);

    // Get screen source
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 },
    });

    const primaryScreen = sources[0];

    // Create video track from screen
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: primaryScreen.id,
          maxWidth: 1920,
          maxHeight: 1080,
          maxFrameRate: 15,
        },
      } as any,
    });

    const videoTrack = new LocalVideoTrack(stream.getVideoTracks()[0]);
    await room.localParticipant.publishTrack(videoTrack, {
      name: "screen",
      simulcast: false,
      source: "screen_share",
    });

    isStreaming = true;
    console.log("Streaming started");

    // Handle room events
    room.on(RoomEvent.Disconnected, () => {
      isStreaming = false;
      console.log("Disconnected from room");
    });

  } catch (error) {
    console.error("Failed to start streaming:", error);
    isStreaming = false;
  }
}

async function stopStreaming() {
  if (room) {
    await room.disconnect();
    room = null;
  }
  isStreaming = false;
  console.log("Streaming stopped");
}

// IPC handlers
ipcMain.handle("get-status", () => ({ isStreaming, deviceId: CONFIG.deviceId }));
ipcMain.handle("start-streaming", startStreaming);
ipcMain.handle("stop-streaming", stopStreaming);

app.whenReady().then(() => {
  createWindow();
  const updateTray = createTray();

  // Update tray every 5 seconds
  setInterval(updateTray, 5000);
});

app.on("window-all-closed", (e: Event) => {
  e.preventDefault(); // Don't quit, stay in tray
});
```

#### File: `employee-agent/package.json`

```json
{
  "name": "taskify-agent",
  "version": "1.0.0",
  "description": "XeTask Desktop Monitoring Agent",
  "main": "electron/main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.taskify.agent",
    "productName": "XeTask Agent",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    }
  },
  "dependencies": {
    "electron-store": "^8.1.0",
    "livekit-client": "^2.0.0",
    "node-machine-id": "^1.1.12"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 5.5 LiveKit Server Setup

#### Docker Compose: `docker-compose.yml`

```yaml
version: "3.9"

services:
  livekit:
    image: livekit/livekit-server:latest
    command: --config /etc/livekit.yaml
    restart: unless-stopped
    ports:
      - "7880:7880"   # HTTP
      - "7881:7881"   # WebSocket
      - "7882:7882"   # TCP (TURN)
      - "50000-60000:50000-60000/udp"  # UDP (WebRTC)
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml

  redis:
    image: redis:7-alpine
    restart: unless-stopped
```

#### LiveKit Config: `livekit.yaml`

```yaml
port: 7880
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 60000
  use_external_ip: true

redis:
  address: redis:6379

keys:
  # Generate with: openssl rand -base64 32
  APIXeTask: YOUR_SECRET_KEY_HERE

logging:
  level: info
```

### 5.6 Backend Monitoring API

#### File: `app/api/monitoring/sessions/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;

// POST /api/monitoring/sessions - Register new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, deviceName, userId } = body;

    // Create or update session
    const session = await prisma.desktopSession.upsert({
      where: { deviceId },
      create: {
        deviceId,
        deviceName,
        userId,
        status: "ONLINE",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
      update: {
        status: "STREAMING",
        lastActive: new Date(),
      },
    });

    // Generate LiveKit token
    const roomName = `monitoring-${session.id}`;
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: deviceId,
      name: deviceName,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: false,
    });

    const token = at.toJwt();

    return NextResponse.json({
      sessionId: session.id,
      roomName,
      token,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/monitoring/sessions - List active sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.desktopSession.findMany({
      where: {
        status: { in: ["ONLINE", "STREAMING", "IDLE"] },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { lastActive: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### File: `app/api/monitoring/sessions/[id]/viewer-token/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;

// GET /api/monitoring/sessions/[id]/viewer-token
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = await getServerSession();
    if (!userSession || !["ADMIN", "MANAGER"].includes(userSession.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const monitoringSession = await prisma.desktopSession.findUnique({
      where: { id: params.id },
    });

    if (!monitoringSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const roomName = `monitoring-${monitoringSession.id}`;
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: `viewer-${userSession.user.id}`,
      name: userSession.user.name,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: false,
      canSubscribe: true,
    });

    const token = at.toJwt();

    return NextResponse.json({
      token,
      roomName,
      livekitUrl: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.error("Error generating viewer token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 5.7 Dashboard Viewer Components

#### File: `components/monitoring/live-sessions.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Session {
  id: string;
  deviceName: string;
  status: string;
  lastActive: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    jobTitle: string;
  };
}

interface LiveSessionsProps {
  onViewSession: (sessionId: string) => void;
}

export function LiveSessions({ onViewSession }: LiveSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/monitoring/sessions");
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "STREAMING":
        return "bg-green-500";
      case "ONLINE":
        return "bg-blue-500";
      case "IDLE":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Live Sessions ({sessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={session.user.avatar} />
                      <AvatarFallback>
                        {session.user.firstName[0]}
                        {session.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                        session.status
                      )}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {session.user.firstName} {session.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.user.jobTitle}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {session.status.toLowerCase()}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  {session.deviceName}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Active {formatDistanceToNow(new Date(session.lastActive))} ago
                </div>
              </div>

              <Button
                className="w-full mt-4"
                variant="secondary"
                onClick={() => onViewSession(session.id)}
                disabled={session.status !== "STREAMING"}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Screen
              </Button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No active sessions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### File: `components/monitoring/screen-viewer.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface ScreenViewerProps {
  sessionId: string;
  employeeName: string;
  onClose: () => void;
}

function VideoDisplay() {
  const tracks = useTracks([Track.Source.ScreenShare]);

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Waiting for screen share...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {tracks.map((track) => (
        <VideoTrack
          key={track.participant.identity}
          trackRef={track}
          className="w-full h-full object-contain"
        />
      ))}
    </div>
  );
}

export function ScreenViewer({ sessionId, employeeName, onClose }: ScreenViewerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/monitoring/sessions/${sessionId}/viewer-token`);
        if (!res.ok) throw new Error("Failed to get token");
        const data = await res.json();
        setToken(data.token);
        setRoomName(data.roomName);
        setLivekitUrl(data.livekitUrl);
      } catch (err) {
        setError("Failed to connect to stream");
        console.error(err);
      }
    };

    fetchToken();
  }, [sessionId]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!token || !roomName || !livekitUrl) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          Connecting to stream...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullscreen ? "fixed inset-4 z-50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">
          Viewing: {employeeName}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[400px]"}>
          <LiveKitRoom
            serverUrl={livekitUrl}
            token={token}
            connect={true}
            video={false}
            audio={false}
          >
            <VideoDisplay />
          </LiveKitRoom>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5.8 Monitoring Page

#### File: `app/monitoring/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { LiveSessions } from "@/components/monitoring/live-sessions";
import { ScreenViewer } from "@/components/monitoring/screen-viewer";

export default function MonitoringPage() {
  const [viewingSession, setViewingSession] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Desktop Monitoring</h1>
          <p className="text-muted-foreground">
            View live employee desktop screens
          </p>
        </div>

        {viewingSession && (
          <ScreenViewer
            sessionId={viewingSession.id}
            employeeName={viewingSession.name}
            onClose={() => setViewingSession(null)}
          />
        )}

        <LiveSessions
          onViewSession={(id) =>
            setViewingSession({ id, name: "Employee" })
          }
        />
      </div>
    </Layout>
  );
}
```

### 5.9 Environment Variables

Add to `.env`:

```env
# LiveKit Configuration
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=APIXeTask
LIVEKIT_API_SECRET=your-secret-key-here

# Screenshot Storage (Optional)
AWS_S3_BUCKET=taskify-screenshots
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

---

## 6. Implementation Timeline

### Phase 1: Foundation (Week 1-2)

| Task | Duration | Dependencies |
|------|----------|--------------|
| Setup PostgreSQL database | 2 days | None |
| Implement Prisma schema | 2 days | Database |
| Setup NextAuth.js | 2 days | Prisma |
| Create base API structure | 3 days | Auth |
| Connect existing UI to APIs | 3 days | API |

### Phase 2: Core Features (Week 3-4)

| Task | Duration | Dependencies |
|------|----------|--------------|
| User management API | 2 days | Phase 1 |
| Task management API | 2 days | Phase 1 |
| Attendance API | 2 days | Phase 1 |
| Team/Project APIs | 2 days | Phase 1 |
| Update all UI components | 4 days | APIs |

### Phase 3: Performance Review (Week 5-6)

| Task | Duration | Dependencies |
|------|----------|--------------|
| Performance review schema | 1 day | Phase 1 |
| Review API endpoints | 2 days | Schema |
| Review form components | 3 days | API |
| Self-assessment feature | 2 days | Components |
| Employee profile page | 2 days | Components |
| Goal tracking | 2 days | Components |

### Phase 4: Desktop Monitoring (Week 7-9)

| Task | Duration | Dependencies |
|------|----------|--------------|
| Setup LiveKit server | 2 days | None |
| Create Electron agent | 5 days | LiveKit |
| Monitoring API endpoints | 2 days | Phase 1 |
| Dashboard viewer | 3 days | API |
| Testing & optimization | 3 days | All |

### Phase 5: Testing & Deployment (Week 10)

| Task | Duration | Dependencies |
|------|----------|--------------|
| Integration testing | 3 days | All phases |
| Performance optimization | 2 days | Testing |
| Documentation | 2 days | All |
| Deployment setup | 2 days | All |

---

## 7. Technical Requirements

### 7.1 Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 50 GB SSD | 100+ GB SSD |
| Bandwidth | 100 Mbps | 1 Gbps |

### 7.2 Software Requirements

| Software | Version |
|----------|---------|
| Node.js | 18.x or higher |
| PostgreSQL | 14.x or higher |
| Docker | 20.x or higher |
| Redis | 7.x (for LiveKit) |

### 7.3 Third-Party Services

| Service | Purpose | Alternative |
|---------|---------|-------------|
| Vercel | Hosting | AWS, DigitalOcean |
| Supabase/Neon | Database | AWS RDS, PlanetScale |
| AWS S3 | File storage | Cloudinary, MinIO |
| SendGrid | Email | Mailgun, AWS SES |

### 7.4 Security Considerations

| Area | Implementation |
|------|----------------|
| Authentication | JWT with secure cookies |
| Password Storage | bcrypt with salt rounds |
| API Security | Rate limiting, CORS |
| Data Encryption | TLS/SSL, encrypted at rest |
| Desktop Monitoring | Employee consent, activity indicators |
| Access Control | Role-based permissions |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 21, 2026 | Claude Code | Initial document |

---

*This implementation plan provides a comprehensive roadmap for transforming XeTask from a frontend UI template into a fully functional team management application with advanced monitoring capabilities.*
