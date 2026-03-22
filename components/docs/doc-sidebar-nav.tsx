"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, LucideIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import docNavItems from "@/components/docs/doc-nav-items"

interface NavChild {
  name: string
  href: string
  icon?: LucideIcon
}

interface NavSection {
  name: string
  href: string
  icon: LucideIcon
  children?: NavChild[]
}

export function DocSidebarNav() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const isActiveSection = (section: NavSection) => {
    if (pathname === section.href) return true
    if (section.children) {
      return section.children.some((child) => pathname === child.href)
    }
    return false
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="pr-2 py-6">
        <div className="px-4">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Documentation</h4>
        </div>
        <div className="grid grid-flow-row auto-rows-max">
          {docNavItems.map((section, index) => (
            <div key={section.href} className="px-3 py-1">
              {section.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isActiveSection(section) && "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      <section.icon className="mr-2 h-4 w-4" />
                      <span>{section.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections[section.name] || isActiveSection(section) ? "rotate-180" : "",
                      )}
                    />
                  </button>
                  {(openSections[section.name] || isActiveSection(section)) && (
                    <div className="mt-1 pl-4 border-l ml-2">
                      {section.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                            isActive(child.href) && "bg-accent/50 font-medium text-accent-foreground",
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={section.href}
                  className={cn(
                    "flex items-center rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive(section.href) && "bg-accent text-accent-foreground",
                  )}
                >
                  <section.icon className="mr-2 h-4 w-4" />
                  <span>{section.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
