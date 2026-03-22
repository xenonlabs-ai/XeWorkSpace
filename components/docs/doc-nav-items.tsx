import { FileText, HelpCircle, Home, Image, Settings, Shield, Palette, Type } from "lucide-react"

const docNavItems = [
  {
    name: "Getting Started",
    href: "/docs",
    icon: Home,
    children: [
      { name: "Introduction", href: "/docs/introduction" },
      { name: "Installation", href: "/docs/installation" },
    //   { name: "Quick Start", href: "/docs/quick-start" },
      { name: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    name: "Configuration",
    href: "/docs/configuration",
    icon: Settings,
    children: [
      {
        name: "Theme Configuration",
        href: "/docs/configuration/theme-config",
      },
      {
        name: "Changing Logo",
        href: "/docs/configuration/change-logo",
        icon: Image,
      },
      {
        name: "Changing Colors",
        href: "/docs/configuration/change-colors",
        icon: Palette,
      },
      {
        name: "Changing Fonts",
        href: "/docs/configuration/change-fonts",
        icon: Type,
      },
    //   {
    //     name: "API Configuration",
    //     href: "/docs/configuration/api-config",
    //   },
    //   {
    //     name: "Feature Flags",
    //     href: "/docs/configuration/feature-flags",
    //   },
    ],
  },
//   { name: "FAQ", href: "/docs/faq", icon: HelpCircle },
//   { name: "Troubleshooting", href: "/docs/troubleshooting", icon: Shield },
//   { name: "Changelog", href: "/docs/changelog", icon: FileText },
]

export default docNavItems
