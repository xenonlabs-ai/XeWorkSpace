import {
    BarChart3,
    BookOpen,
    Calendar,
    CheckSquare,
    Clock,
    FileText,
    Folder,
    FolderArchive,
    Home,
    MessageSquare,
    Monitor,
    Settings,
    ShieldCheck,
    Users
} from "lucide-react"

// Centralized navigation items configuration
const navItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: Home,
    },
    {
        name: "Members",
        href: "/members",
        icon: Users,
    },
    {
        name: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
    },
    {
        name: "Calendar",
        href: "/calendar",
        icon: Calendar,
    },
    {
        name: "Performance",
        href: "/performance",
        icon: BarChart3,
    },
    {
        name: "Messages",
        href: "/messages",
        icon: MessageSquare,
    },
    {
        name: "Attendance",
        href: "/attendance",
        icon: Clock,
    },
    {
        name: "Monitoring",
        href: "/monitoring",
        icon: Monitor,
    },
    {
        name: "Reports",
        href: "/reports",
        icon: FileText,
    },
    {
        name: "Roles & Permissions",
        href: "/roles-permissions",
        icon: ShieldCheck,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
    {
        name: "Documentation",
        href: "/docs",
        icon: BookOpen,
    },
    {
        name: "Sub Menu",
        href: "#",
        icon: Folder,
        subItems: [
            {
                name: "Sub Menu 1",
                href: "#1",
                icon: Folder,
            },
            {
                name: "Sub Menu 2",
                href: "#2",
                icon: FolderArchive,
            },
        ],
    },
]

export default navItems
