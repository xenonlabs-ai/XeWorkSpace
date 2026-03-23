export interface Member {
  id: string | number;
  name: string;
  role: string;
  email: string;
  accessLevel: "Owner" | "Admin" | "Manager" | "Member" | "Viewer" | string;
  status: "Active" | "Away" | "Offline" | string;
  avatar: string;
  skills: string[];
  projects: string[];
  bio: string;
  phone: string;
  location: string;
  joinedDate: string;
  monitoringStatus?: "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED";
}

// Members are now fetched from the API
// This file only exports the Member type
