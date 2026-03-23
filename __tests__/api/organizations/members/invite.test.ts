import { POST } from '@/app/api/organizations/members/invite/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('abcdefghijkl')),
}));

describe('POST /api/organizations/members/invite', () => {
  const mockSession = {
    user: {
      id: 'admin-user-id',
      email: 'admin@test.com',
      role: 'ADMIN',
    },
  };

  const mockCurrentUser = {
    id: 'admin-user-id',
    email: 'admin@test.com',
    role: 'ADMIN',
    organizationId: 'org-123',
    organization: {
      id: 'org-123',
      name: 'Test Organization',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockCurrentUser);
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 if user has no organization', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockCurrentUser,
      organizationId: null,
      organization: null,
    });

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('No organization found');
  });

  it('should return 403 if user role is not OWNER, ADMIN, or MANAGER', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockCurrentUser,
      role: 'MEMBER',
    });

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        // missing firstName and lastName
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email, first name, and last name are required');
  });

  it('should return 400 if user already exists in the same organization', async () => {
    // First call returns current user, second call returns existing user
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(mockCurrentUser)
      .mockResolvedValueOnce({
        id: 'existing-user-id',
        email: 'existing@test.com',
        organizationId: 'org-123',
      });

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@test.com',
        firstName: 'Existing',
        lastName: 'User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('User is already a member of this organization');
  });

  it('should return 403 if trying to invite with equal or higher role', async () => {
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(mockCurrentUser)
      .mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'OWNER',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Cannot invite member with equal or higher role than yourself');
  });

  it('should successfully create a new user with temp password', async () => {
    const newUser = {
      id: 'new-user-id',
      email: 'newuser@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'MEMBER',
      department: 'Engineering',
      jobTitle: 'Developer',
      createdAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(mockCurrentUser)
      .mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
    (prisma.notification.create as jest.Mock).mockResolvedValue({});

    const request = new NextRequest('http://localhost/api/organizations/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'MEMBER',
        department: 'Engineering',
        jobTitle: 'Developer',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user.id).toBe(newUser.id);
    expect(data.user.email).toBe(newUser.email);
    expect(data.user.firstName).toBe(newUser.firstName);
    expect(data.user.lastName).toBe(newUser.lastName);
    expect(data.user.role).toBe(newUser.role);
    expect(data.tempPassword).toBeDefined();
    expect(data.message).toBe('User created successfully. Temporary password generated.');

    // Verify user was created with correct data
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'newuser@test.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'MEMBER',
          requiresPasswordChange: true,
          organizationId: 'org-123',
        }),
      })
    );

    // Verify notification was created
    expect(prisma.notification.create).toHaveBeenCalled();
  });
});
