import { GET } from '@/app/api/monitoring/consent/route';
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
      findMany: jest.fn(),
      count: jest.fn(),
    },
    monitoringConsent: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

describe('GET /api/monitoring/consent', () => {
  const mockAdminSession = {
    user: {
      id: 'admin-123',
      email: 'admin@test.com',
      role: 'ADMIN',
    },
  };

  const mockUsers = [
    {
      id: 'user-1',
      email: 'user1@test.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      department: 'Engineering',
      jobTitle: 'Developer',
      monitoringConsent: {
        adminEnabled: true,
        employeeConsented: true,
        revokedAt: null,
      },
    },
    {
      id: 'user-2',
      email: 'user2@test.com',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: null,
      department: 'Sales',
      jobTitle: 'Sales Rep',
      monitoringConsent: {
        adminEnabled: true,
        employeeConsented: false,
        revokedAt: null,
      },
    },
    {
      id: 'user-3',
      email: 'user3@test.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      avatar: null,
      department: 'HR',
      jobTitle: 'HR Manager',
      monitoringConsent: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockAdminSession);
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    (prisma.user.count as jest.Mock).mockResolvedValue(3);
  });

  it('should return 403 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/monitoring/consent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });

  it('should return 403 if user is not ADMIN or MANAGER', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123', role: 'MEMBER' },
    });

    const request = new NextRequest('http://localhost/api/monitoring/consent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });

  it('should return all users with consent status', async () => {
    const request = new NextRequest('http://localhost/api/monitoring/consent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toHaveLength(3);
    expect(data.users[0].consentStatus).toBe('ACTIVE');
    expect(data.users[1].consentStatus).toBe('PENDING_EMPLOYEE');
    expect(data.users[2].consentStatus).toBe('NOT_ENABLED');
    expect(data.pagination).toBeDefined();
    expect(data.pagination.total).toBe(3);
  });

  it('should filter by enabled status', async () => {
    const request = new NextRequest('http://localhost/api/monitoring/consent?status=enabled');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should only return users where adminEnabled is true
    expect(data.users).toHaveLength(2);
    expect(data.users.every((u: any) => u.consentStatus !== 'NOT_ENABLED')).toBe(true);
  });

  it('should filter by pending status', async () => {
    const request = new NextRequest('http://localhost/api/monitoring/consent?status=pending');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should only return users waiting for employee consent
    expect(data.users).toHaveLength(1);
    expect(data.users[0].consentStatus).toBe('PENDING_EMPLOYEE');
  });

  it('should filter by consented status', async () => {
    const request = new NextRequest('http://localhost/api/monitoring/consent?status=consented');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should only return users who have fully consented
    expect(data.users).toHaveLength(1);
    expect(data.users[0].consentStatus).toBe('ACTIVE');
  });

  it('should handle pagination', async () => {
    const request = new NextRequest('http://localhost/api/monitoring/consent?page=1&limit=10');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
  });

  it('should handle revoked consent status', async () => {
    const usersWithRevoked = [
      {
        ...mockUsers[0],
        monitoringConsent: {
          adminEnabled: true,
          employeeConsented: false,
          revokedAt: new Date(),
        },
      },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(usersWithRevoked);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const request = new NextRequest('http://localhost/api/monitoring/consent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users[0].consentStatus).toBe('REVOKED');
  });
});
