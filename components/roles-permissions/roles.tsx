
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronDown,
  Copy,
  Download,
  Edit,
  Filter,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";

export function Roles() {
  const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Full access to all resources",
      users: 2,
      type: "system",
      lastModified: "2 days ago",
      status: "active",
    },
    {
      id: 2,
      name: "Manager",
      description: "Can manage team members and projects",
      users: 4,
      type: "custom",
      lastModified: "1 week ago",
      status: "active",
    },
    {
      id: 3,
      name: "Member",
      description: "Regular team member with limited access",
      users: 8,
      type: "system",
      lastModified: "2 weeks ago",
      status: "active",
    },
    {
      id: 4,
      name: "Viewer",
      description: "Read-only access to resources",
      users: 3,
      type: "custom",
      lastModified: "1 month ago",
      status: "active",
    },
    {
      id: 5,
      name: "Guest",
      description: "Limited access to specific resources",
      users: 5,
      type: "custom",
      lastModified: "3 days ago",
      status: "inactive",
    },
  ];

  const users = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Sarah Williams" },
    { id: 3, name: "Michael Brown" },
  ];

  const auditLogs = [
    { id: 1, action: "Role Created" },
    { id: 2, action: "Permission Changed" },
    { id: 3, action: "User Assigned" },
  ];

  return (
    <div className="space-y-8">
      {/* STATISTICS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-medium font-medium">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{roles.length}</div>
              <p className="text-sm text-destructive">
                {roles.filter((r) => r.type === "system").length} system,{" "}
                {roles.filter((r) => r.type === "custom").length} custom
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-medium font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{users.length}</div>
              <p className="text-sm text-destructive">
                Across {roles.filter((r) => r.status === "active").length}{" "}
                active roles
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-medium font-medium">
              Recent Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{auditLogs.length}</div>
              <p className="text-sm text-destructive">Last 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROLE MANAGEMENT CARD */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Role Management
              </CardTitle>
              <CardDescription>
                View and manage organizational roles
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Role
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> Export
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/50 font-medium">
                    Role
                  </TableHead>
                  <TableHead className="bg-muted/50 font-medium">
                    Description
                  </TableHead>
                  <TableHead className="bg-muted/50 font-medium">
                    Type
                  </TableHead>
                  <TableHead className="bg-muted/50 font-medium">
                    Users
                  </TableHead>
                  <TableHead className="bg-muted/50 font-medium">
                    Last Modified
                  </TableHead>
                  <TableHead className="bg-muted/50 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-right bg-muted/50 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {roles.map((role) => (
                  <TableRow
                    key={role.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          role.type === "system" ? "secondary" : "outline"
                        }
                        className="capitalize"
                      >
                        {role.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {role.users}
                      </div>
                    </TableCell>
                    <TableCell>{role.lastModified}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          role.status === "active" ? "secondary" : "destructive"
                        }
                        className="capitalize"
                      >
                        {role.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* EDIT */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader>
                              <DialogTitle>Edit Role</DialogTitle>
                              <DialogDescription>
                                Modify role details and access level.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Name</Label>
                                <Input
                                  defaultValue={role.name}
                                  disabled={role.type === "system"}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">
                                  Description
                                </Label>
                                <Input
                                  defaultValue={role.description}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Status</Label>
                                <div className="flex items-center gap-2 col-span-3">
                                  <Switch
                                    defaultChecked={role.status === "active"}
                                  />
                                  <span className="text-sm">
                                    {role.status === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* DUPLICATE */}
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>

                        {/* DELETE */}
                        {role.type !== "system" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Role?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The role{" "}
                                  <strong>{role.name}</strong> will be removed
                                  permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-white">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {roles.length} of {roles.length} roles
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
