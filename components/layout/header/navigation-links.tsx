"use client"

import navItems from "@/components/layout/navItems"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavigationLinks() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path) && path !== "#") return true
    return false
  }

  return (
    <NavigationMenu className="hidden md:flex ml-4" viewport={false}>
      <NavigationMenuList className="gap-1">
        {navItems.map((item: any) => {
          const active = isActive(item.href)
          const hasSubItems = item.subItems && item.subItems.length > 0

          if (hasSubItems) {
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuTrigger
                  className={cn(
                    "h-auto py-2 px-3 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                    active ? "text-foreground font-semibold" : "text-foreground/60",
                    "hover:text-foreground/80"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    {item.subItems.map((subItem: any) => (
                      <li key={subItem.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(subItem.href) && "bg-accent text-accent-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2 text-sm font-medium">
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              {subItem.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex-row h-auto py-2 px-3 bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent",
                    active ? "text-foreground font-semibold" : "text-foreground/60",
                    "hover:text-foreground/80"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
