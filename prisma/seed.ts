import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create XenonLabs Admin User
  const xenonAdminPassword = await bcrypt.hash("Xenon$1234", 10);
  const xenonAdmin = await prisma.user.upsert({
    where: { email: "support@xenonlabs.ai" },
    update: { password: xenonAdminPassword },
    create: {
      email: "support@xenonlabs.ai",
      password: xenonAdminPassword,
      firstName: "Support",
      lastName: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
      department: "Administration",
      jobTitle: "System Administrator",
      skills: JSON.stringify(["Administration", "Support", "Management"]),
    },
  });
  console.log("✅ Created XenonLabs admin:", xenonAdmin.email);

  // Create XenonLabs Employee User
  const xenonEmployeePassword = await bcrypt.hash("Xenon$1234", 10);
  const xenonEmployee = await prisma.user.upsert({
    where: { email: "abhisek.sinha@xenonlabs.ai" },
    update: { password: xenonEmployeePassword },
    create: {
      email: "abhisek.sinha@xenonlabs.ai",
      password: xenonEmployeePassword,
      firstName: "Abhisek",
      lastName: "Sinha",
      role: "MEMBER",
      status: "ACTIVE",
      department: "Engineering",
      jobTitle: "Software Engineer",
      skills: JSON.stringify(["JavaScript", "React", "Node.js", "TypeScript"]),
    },
  });
  console.log("✅ Created XenonLabs employee:", xenonEmployee.email);

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@xetask.com" },
    update: {},
    create: {
      email: "admin@xetask.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      status: "ACTIVE",
      department: "Management",
      jobTitle: "System Administrator",
      skills: JSON.stringify(["Leadership", "Management", "Strategy"]),
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create Manager User
  const managerPassword = await bcrypt.hash("manager123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@xetask.com" },
    update: {},
    create: {
      email: "manager@xetask.com",
      password: managerPassword,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "MANAGER",
      status: "ACTIVE",
      department: "Engineering",
      jobTitle: "Engineering Manager",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      skills: JSON.stringify(["Project Management", "Agile", "Team Leadership"]),
    },
  });
  console.log("✅ Created manager user:", manager.email);

  // Create Regular Users
  const memberPassword = await bcrypt.hash("member123", 10);

  const users = [
    {
      email: "alex.johnson@xetask.com",
      firstName: "Alex",
      lastName: "Johnson",
      department: "Engineering",
      jobTitle: "Senior Developer",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    },
    {
      email: "samantha.lee@xetask.com",
      firstName: "Samantha",
      lastName: "Lee",
      department: "Design",
      jobTitle: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "CSS", "User Research"],
    },
    {
      email: "michael.chen@xetask.com",
      firstName: "Michael",
      lastName: "Chen",
      department: "Engineering",
      jobTitle: "Full Stack Developer",
      skills: ["Python", "Django", "React", "PostgreSQL"],
    },
    {
      email: "emily.rodriguez@xetask.com",
      firstName: "Emily",
      lastName: "Rodriguez",
      department: "Marketing",
      jobTitle: "Marketing Specialist",
      skills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
    },
    {
      email: "david.kim@xetask.com",
      firstName: "David",
      lastName: "Kim",
      department: "Design",
      jobTitle: "Product Designer",
      skills: ["Product Design", "Prototyping", "Design Systems"],
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: memberPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "MEMBER",
        status: "ACTIVE",
        department: userData.department,
        jobTitle: userData.jobTitle,
        skills: JSON.stringify(userData.skills),
      },
    });
    createdUsers.push(user);
    console.log("✅ Created user:", user.email);
  }

  // Create Team
  const team = await prisma.team.upsert({
    where: { id: "team-engineering" },
    update: {},
    create: {
      id: "team-engineering",
      name: "Engineering Team",
      description: "Core engineering and development team",
    },
  });
  console.log("✅ Created team:", team.name);

  // Add members to team
  for (const user of [manager, ...createdUsers.filter(u => u.department === "Engineering")]) {
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: team.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        teamId: team.id,
        role: user.role === "MANAGER" ? "lead" : "member",
      },
    });
  }
  console.log("✅ Added members to team");

  // Create Project
  const project = await prisma.project.upsert({
    where: { id: "project-xetask" },
    update: {},
    create: {
      id: "project-xetask",
      name: "XeTask Platform",
      description: "Main project for the XeTask application development",
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 45,
      teamId: team.id,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
    },
  });
  console.log("✅ Created project:", project.name);

  // Create Tasks
  const tasks = [
    {
      title: "Implement user authentication",
      description: "Set up NextAuth.js with credentials provider",
      status: "COMPLETED",
      priority: "HIGH",
      category: "Backend",
      assigneeId: createdUsers[0].id,
    },
    {
      title: "Design dashboard layout",
      description: "Create responsive dashboard with widgets",
      status: "COMPLETED",
      priority: "HIGH",
      category: "Design",
      assigneeId: createdUsers[1].id,
    },
    {
      title: "Build task management module",
      description: "Create CRUD operations for tasks",
      status: "IN_PROGRESS",
      priority: "HIGH",
      category: "Backend",
      assigneeId: createdUsers[2].id,
    },
    {
      title: "Implement performance reviews",
      description: "Build employee performance review system",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      category: "Backend",
      assigneeId: createdUsers[0].id,
    },
    {
      title: "Create marketing materials",
      description: "Design promotional content for launch",
      status: "TODO",
      priority: "LOW",
      category: "Marketing",
      assigneeId: createdUsers[3].id,
    },
    {
      title: "Design system documentation",
      description: "Document all design components and patterns",
      status: "TODO",
      priority: "MEDIUM",
      category: "Design",
      assigneeId: createdUsers[4].id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        projectId: project.id,
        creatorId: manager.id,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        completedAt: taskData.status === "COMPLETED" ? new Date() : null,
      },
    });
  }
  console.log("✅ Created", tasks.length, "tasks");

  // Create Attendance Records for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const user of createdUsers) {
    const checkIn = new Date(today);
    checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));

    await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {},
      create: {
        userId: user.id,
        date: today,
        checkIn: checkIn,
        status: checkIn.getHours() > 9 ? "LATE" : "PRESENT",
        workType: Math.random() > 0.3 ? "OFFICE" : "REMOTE",
      },
    });
  }
  console.log("✅ Created attendance records");

  // Create Performance Review
  const review = await prisma.performanceReview.create({
    data: {
      employeeId: createdUsers[0].id,
      reviewerId: manager.id,
      reviewPeriod: "Q1 2026",
      reviewType: "QUARTERLY",
      status: "COMPLETED",
      productivityRating: 4,
      qualityRating: 5,
      communicationRating: 4,
      teamworkRating: 5,
      initiativeRating: 4,
      punctualityRating: 4,
      technicalSkillsRating: 5,
      overallRating: 4.43,
      strengths: "Excellent technical skills and problem-solving abilities. Great team player.",
      areasForImprovement: "Could improve on documentation and knowledge sharing.",
      managerComments: "Alex has been a valuable asset to the team. Keep up the great work!",
      submittedAt: new Date(),
    },
  });
  console.log("✅ Created performance review");

  // Create Goals
  await prisma.goal.createMany({
    data: [
      {
        userId: createdUsers[0].id,
        reviewId: review.id,
        title: "Complete advanced TypeScript certification",
        description: "Obtain TypeScript certification to enhance skills",
        progress: 60,
        status: "IN_PROGRESS",
        targetDate: new Date("2026-06-30"),
      },
      {
        userId: createdUsers[0].id,
        reviewId: review.id,
        title: "Mentor junior developers",
        description: "Conduct weekly knowledge sharing sessions",
        progress: 30,
        status: "IN_PROGRESS",
        targetDate: new Date("2026-12-31"),
      },
    ],
  });
  console.log("✅ Created goals");

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Login Credentials:");
  console.log("   XenonLabs Admin: support@xenonlabs.ai / Xenon$1234");
  console.log("   XenonLabs Employee: abhisek.sinha@xenonlabs.ai / Xenon$1234");
  console.log("   Admin: admin@xetask.com / admin123");
  console.log("   Manager: manager@xetask.com / manager123");
  console.log("   Member: alex.johnson@xetask.com / member123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
