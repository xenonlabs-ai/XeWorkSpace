import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"

export function TasksHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tasks..." className="w-full md:w-[200px] pl-8" />
        </div>
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button> */}
      </div>
    </div>
  )
}
