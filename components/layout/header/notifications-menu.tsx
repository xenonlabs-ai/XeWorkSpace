
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
import Link from "next/link"

interface Notification {
	id: number
	title: string
	description: string
	time: string
	unread: boolean
}

interface NotificationsMenuProps {
	notifications: Notification[]
}

export function NotificationsMenu({ notifications }: NotificationsMenuProps) {
  const unreadCount = notifications.filter((n) => n.unread).length

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
            <p className="text-xs text-muted-foreground">You have {unreadCount} unread notifications</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0">
            <div className="w-full p-2">
              <div className="flex justify-between w-full">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer justify-center">
          <Link href="/#" className="flex items-center justify-center">
            <span className="text-sm">View all notifications</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
