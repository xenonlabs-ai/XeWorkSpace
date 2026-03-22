
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Bell,
    Building2,
    Clock,
    CreditCard,
    FileText,
    Globe,
    HardDrive,
    KeyRound,
    MessageSquare,
    Palette,
    Plug,
    Search,
    Shield,
    Users,
    Workflow,
} from "lucide-react"

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const sections = [
    {
      label: "Organization",
      items: [
        { id: "organization", label: "Organization Profile", icon: Building2 },
        { id: "members", label: "Members & Teams", icon: Users },
        { id: "branding", label: "Branding", icon: Palette },
        { id: "domains", label: "Domains", icon: Globe },
      ],
    },
    {
      label: "Preferences",
      items: [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "localization", label: "Localization", icon: Globe },
        { id: "accessibility", label: "Accessibility", icon: Users },
      ],
    },
    {
      label: "System",
      items: [
        { id: "integrations", label: "Integrations", icon: Plug },
        { id: "api", label: "API Keys", icon: KeyRound },
        { id: "storage", label: "Storage", icon: HardDrive },
        { id: "automation", label: "Automation", icon: Workflow },
      ],
    },
    {
      label: "Billing",
      items: [
        { id: "subscription", label: "Subscription", icon: CreditCard },
        { id: "payment", label: "Payment Methods", icon: CreditCard },
        { id: "invoices", label: "Invoices", icon: FileText },
        { id: "usage", label: "Usage", icon: Clock },
      ],
    },
    {
      label: "Security",
      items: [
        { id: "security", label: "Security Settings", icon: Shield },
        { id: "authentication", label: "Authentication", icon: KeyRound },
        { id: "audit", label: "Audit Logs", icon: FileText },
        { id: "privacy", label: "Privacy", icon: Shield },
      ],
    },
    {
      label: "Support",
      items: [
        { id: "help", label: "Help Center", icon: MessageSquare },
        { id: "feedback", label: "Feedback", icon: MessageSquare },
      ],
    },
  ]

  return (
    <Sidebar className="border-r border-border" collapsible="none">
      <SidebarContent>
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search settings..." className="w-full bg-background pl-8 text-xs" />
          </div>
        </div>

        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={activeSection === item.id} onClick={() => onSectionChange(item.id)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
