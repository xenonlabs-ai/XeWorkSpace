"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Notification {
	id: string
	title: string
	message: string
	type: string
	read: boolean
	actionUrl?: string
	createdAt: string
}

export function NotificationsMenu() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchNotifications()
    } else {
      setIsLoading(false)
    }
  }, [session])

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground/60 hover:text-foreground hidden sm:flex"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "No new notifications"
              }
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0" asChild={!!notification.actionUrl}>
              {notification.actionUrl ? (
                <Link href={notification.actionUrl} className="w-full">
                  <div className={`w-full p-2 ${!notification.read ? 'bg-muted/50' : ''}`}>
                    <div className="flex justify-between w-full">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </Link>
              ) : (
                <div className={`w-full p-2 ${!notification.read ? 'bg-muted/50' : ''}`}>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer justify-center">
          <Link href="/notifications" className="flex items-center justify-center">
            <span className="text-sm">View all notifications</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
