import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Filter, PlusCircle, Search } from "lucide-react";

export interface MembersHeaderProps {
  onAddMemberClick?: () => void;
}

export function MembersHeader({ onAddMemberClick }: MembersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="w-full md:w-[180px] pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Active Members
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Away Members</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Access Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Admin</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Member</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Viewer</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAddMemberClick} className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
}
