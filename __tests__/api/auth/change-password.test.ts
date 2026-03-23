import { POST } from '@/app/api/auth/change-password/route';
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
      update: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('POST /api/auth/change-password', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      email: 'user@test.com',
    },
  };

  const mockUser = {
    id: 'user-123',
    password: 'hashedCurrentPassword',
    requiresPasswordChange: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        // missing newPassword and confirmPassword
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('All password fields are required');
  });

  it('should return 400 if new passwords do not match', async () => {
    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
        confirmPassword: 'differentpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('New passwords do not match');
  });

  it('should return 400 if new password is less than 8 characters', async () => {
    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'short',
        confirmPassword: 'short',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 8 characters long');
  });

  it('should return 404 if user not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return 400 if current password is incorrect', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Current password is incorrect');
  });

  it('should return 400 if new password is same as current password', async () => {
    // First compare returns true (correct current password)
    // Second compare returns true (same password)
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'samepassword',
        newPassword: 'samepassword',
        confirmPassword: 'samepassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('New password must be different from current password');
  });

  it('should successfully change password', async () => {
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true) // current password is correct
      .mockResolvedValueOnce(false); // new password is different
    (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
    (prisma.user.update as jest.Mock).mockResolvedValue({});

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Password changed successfully');

    // Verify user was updated
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: {
        password: 'newHashedPassword',
        requiresPasswordChange: false,
      },
    });
  });

  it('should handle server errors gracefully', async () => {
    (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
