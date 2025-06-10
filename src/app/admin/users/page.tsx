import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BookUser, Search, Edit3, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockUsers = [
  { id: "USR001", name: "John Doe", email: "john.doe@example.com", dateRegistered: "2024-07-15", status: "Active", tasksSubmitted: 5, lastLogin: "2024-07-20" },
  { id: "USR002", name: "Alice Smith", email: "alice.smith@example.com", dateRegistered: "2024-07-14", status: "Active", tasksSubmitted: 2, lastLogin: "2024-07-19" },
  { id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", dateRegistered: "2024-07-13", status: "Suspended", tasksSubmitted: 10, lastLogin: "2024-07-10" },
  { id: "USR004", name: "Eva Williams", email: "eva.williams@example.com", dateRegistered: "2024-06-20", status: "Pending Approval", tasksSubmitted: 0, lastLogin: "N/A" },
];

export default function AdminManageUsersPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Users"
        description="View, edit, and manage all user accounts on the platform."
        icon={BookUser}
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="font-headline">All Users ({mockUsers.length})</CardTitle>
                <CardDescription>Search, filter, and manage user accounts.</CardDescription>
            </div>
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users by name or email..." className="pl-8 w-full md:w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : user.status === "Suspended" ? "destructive" : "secondary"}
                           className={user.status === "Active" ? "bg-green-500 text-white" : user.status === "Suspended" ? "bg-red-500 text-white" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.tasksSubmitted}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="space-x-1">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Button>
                    {user.status === "Active" && (
                        <Button variant="outline" size="icon" className="h-8 w-8 text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700">
                            <ShieldAlert className="h-4 w-4" /> <span className="sr-only">Suspend</span>
                        </Button>
                    )}
                    {user.status === "Suspended" && (
                        <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                            <ShieldCheck className="h-4 w-4" /> <span className="sr-only">Unsuspend</span>
                        </Button>
                    )}
                     <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
