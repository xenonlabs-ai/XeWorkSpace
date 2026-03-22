"use client"

import { cn } from "@/lib/utils"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { HTMLAttributes } from "react"

export function DocBreadcrumb({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  // Skip rendering if we're on the main docs page
  if (pathname === "/docs") {
    return null
  }

  // Create breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const isLast = index === pathSegments.length - 1

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return {
      href,
      label,
      isLast,
    }
  })

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground mb-6", className)} {...props}>
      <ol className="flex items-center">
        <li className="flex items-center">
          <Link href="/docs" className="flex items-center hover:text-foreground">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {item.isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
