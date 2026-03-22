import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Download, History } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RolesPermissionsHeader() {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search roles or users..." className="w-full sm:w-[220px] pl-8" />
        </div> */}
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="custom">Custom Roles</SelectItem>
            <SelectItem value="system">System Roles</SelectItem>
            <SelectItem value="active">Active Roles</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Export</span>
          </Button>
          <Button variant="outline" size="icon">
            <History className="h-4 w-4" />
            <span className="sr-only">History</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
