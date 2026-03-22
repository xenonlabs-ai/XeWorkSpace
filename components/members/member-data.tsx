export interface Member {
  id: number;
  name: string;
  role: "Developer" | "Designer" | "Marketer";
  email: string;
  accessLevel: "Admin" | "Member" | "Viewer";
  status: "Active" | "Away";
  avatar: string;
  skills: string[];
  projects: string[];
  bio: string;
  phone: string;
  location: string;
  joinedDate: string;
}

// Sample member data with roles
const members: Member[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Developer",
    email: "alex@example.com",
    accessLevel: "Admin",
    status: "Active",
    avatar: "AJ",
    skills: ["React", "Node.js", "TypeScript"],
    projects: ["Website Redesign", "Mobile App"],
    bio: "Full-stack developer with 5 years of experience in building web applications.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinedDate: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Samantha Lee",
    role: "Designer",
    email: "samantha@example.com",
    accessLevel: "Member",
    status: "Active",
    avatar: "SL",
    skills: ["UI/UX", "Figma", "Illustration"],
    projects: ["Brand Refresh", "Website Redesign"],
    bio: "Creative designer passionate about crafting beautiful and intuitive user experiences.",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    joinedDate: "Mar 3, 2024",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Developer",
    email: "michael@example.com",
    accessLevel: "Member",
    status: "Away",
    avatar: "MC",
    skills: ["Python", "Django", "AWS"],
    projects: ["Backend API", "Data Pipeline"],
    bio: "Backend developer specializing in scalable systems and cloud infrastructure.",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    joinedDate: "Feb 10, 2024",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Marketer",
    email: "emily@example.com",
    accessLevel: "Viewer",
    status: "Active",
    avatar: "ER",
    skills: ["Content Strategy", "SEO", "Social Media"],
    projects: ["Q2 Campaign", "Product Launch"],
    bio: "Digital marketer with expertise in growth strategies and content creation.",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    joinedDate: "Apr 5, 2024",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Designer",
    email: "david@example.com",
    accessLevel: "Member",
    status: "Active",
    avatar: "DK",
    skills: ["Product Design", "Prototyping", "Animation"],
    projects: ["Mobile App", "Design System"],
    bio: "Product designer focused on creating seamless user experiences across platforms.",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL",
    joinedDate: "Jan 20, 2024",
  },
  {
    id: 6,
    name: "Jessica Taylor",
    role: "Marketer",
    email: "jessica@example.com",
    accessLevel: "Member",
    status: "Away",
    avatar: "JT",
    skills: ["Email Marketing", "Analytics", "Copywriting"],
    projects: ["Newsletter Redesign", "Customer Retention"],
    bio: "Marketing specialist with a data-driven approach to campaign optimization.",
    phone: "+1 (555) 678-9012",
    location: "Miami, FL",
    joinedDate: "Mar 15, 2024",
  },
  {
    id: 7,
    name: "Ryan Wilson",
    role: "Developer",
    email: "ryan@example.com",
    accessLevel: "Admin",
    status: "Active",
    avatar: "RW",
    skills: ["JavaScript", "React Native", "GraphQL"],
    projects: ["Mobile App", "API Integration"],
    bio: "Mobile developer passionate about creating smooth, native-like experiences.",
    phone: "+1 (555) 789-0123",
    location: "Denver, CO",
    joinedDate: "Feb 1, 2024",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    role: "Designer",
    email: "olivia@example.com",
    accessLevel: "Viewer",
    status: "Active",
    avatar: "OM",
    skills: ["Brand Design", "Typography", "Illustration"],
    projects: ["Brand Refresh", "Marketing Materials"],
    bio: "Visual designer with a strong background in branding and identity design.",
    phone: "+1 (555) 890-1234",
    location: "Portland, OR",
    joinedDate: "Apr 10, 2024",
  },
  {
    id: 9,
    name: "James Brown",
    role: "Marketer",
    email: "james@example.com",
    accessLevel: "Member",
    status: "Away",
    avatar: "JB",
    skills: ["Content Marketing", "PPC", "Market Research"],
    projects: ["Q2 Campaign", "Competitor Analysis"],
    bio: "Strategic marketer specializing in digital advertising and market analysis.",
    phone: "+1 (555) 901-2345",
    location: "Boston, MA",
    joinedDate: "Mar 1, 2024",
  },
]

export function getMemberById(id:number): Member | null {
  return members.find((member) => member.id === id) || null
}

export function getAllMembers(): Member[] {
  return members
}
