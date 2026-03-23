import { GET, PATCH, DELETE } from '@/app/api/organizations/members/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Organization Members API', () => {
  const mockSession = {
    user: {
      id: 'admin-user-id',
      email: 'admin@test.com',
      role: 'ADMIN',
    },
  };

  const mockAdminUser = {
    id: 'admin-user-id',
    email: 'admin@test.com',
    role: 'ADMIN',
    organizationId: 'org-123',
  };

  const mockOwnerUser = {
    id: 'owner-user-id',
    email: 'owner@test.com',
    role: 'OWNER',
    organizationId: 'org-123',
  };

  const mockMembers = [
    {
      id: 'owner-user-id',
      email: 'owner@test.com',
      firstName: 'Owner',
      lastName: 'User',
      role: 'OWNER',
      status: 'ACTIVE',
      department: 'Executive',
      jobTitle: 'CEO',
    },
    {
      id: 'admin-user-id',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      department: 'IT',
      jobTitle: 'Admin',
    },
    {
      id: 'member-user-id',
      email: 'member@test.com',
      firstName: 'Member',
      lastName: 'User',
      role: 'MEMBER',
      status: 'ACTIVE',
      department: 'Engineering',
      jobTitle: 'Developer',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockMembers);
  });

  describe('GET /api/organizations/members', () => {
    it('should return 401 if user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/organizations/members');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return empty array if user has no organization', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockAdminUser,
        organizationId: null,
      });

      const request = new NextRequest('http://localhost/api/organizations/members');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.members).toEqual([]);
    });

    it('should return organization members', async () => {
      const request = new NextRequest('http://localhost/api/organizations/members');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.members).toHaveLength(3);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId: 'org-123' },
        })
      );
    });
  });

  describe('PATCH /api/organizations/members', () => {
    it('should return 401 if user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id', role: 'MANAGER' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 403 if user is not OWNER or ADMIN', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockAdminUser,
        role: 'MEMBER',
      });

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id', role: 'MANAGER' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should return 400 if userId or role is missing', async () => {
      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId and role are required');
    });

    it('should return 404 if target user is not in same organization', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockMembers[2], organizationId: 'other-org' });

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id', role: 'MANAGER' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should return 403 if non-owner tries to modify owner', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce(mockOwnerUser);

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'owner-user-id', role: 'ADMIN' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Cannot modify owner');
    });

    it('should return 403 if non-owner tries to set someone as OWNER', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockMembers[2], organizationId: 'org-123' });

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id', role: 'OWNER' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Only owner can transfer ownership');
    });

    it('should successfully update member role', async () => {
      const updatedMember = { ...mockMembers[2], role: 'MANAGER' };
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockMembers[2], organizationId: 'org-123' });
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedMember);

      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'member-user-id', role: 'MANAGER' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.member.role).toBe('MANAGER');
    });
  });

  describe('DELETE /api/organizations/members', () => {
    it('should return 401 if user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=member-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 if userId is missing', async () => {
      const request = new NextRequest('http://localhost/api/organizations/members', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId is required');
    });

    it('should return 403 if non-admin tries to remove another member', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockAdminUser,
        role: 'MEMBER',
        id: 'other-member-id',
      });
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'other-member-id' },
      });

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=member-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should return 404 if target user is not in same organization', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockMembers[2], organizationId: 'other-org' });

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=member-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should return 403 when trying to remove the owner', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockOwnerUser, organizationId: 'org-123' });

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=owner-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Cannot remove organization owner');
    });

    it('should successfully remove a member', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdminUser)
        .mockResolvedValueOnce({ ...mockMembers[2], organizationId: 'org-123' });
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=member-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'member-user-id' },
        data: {
          organizationId: null,
          role: 'MEMBER',
        },
      });
    });

    it('should allow users to remove themselves', async () => {
      const memberUser = { ...mockMembers[2], organizationId: 'org-123' };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'member-user-id' },
      });
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(memberUser)
        .mockResolvedValueOnce(memberUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = new NextRequest(
        'http://localhost/api/organizations/members?userId=member-user-id',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
