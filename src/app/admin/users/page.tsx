
"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookUser, Search, Edit3, Trash2, ShieldAlert, ShieldCheck, Eye, PlusCircle, MoreHorizontal, UserCircle2, CalendarDays, Mail, Smartphone, Verified, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UserStatus = 'Active' | 'Suspended' | 'Pending Approval' | 'Deleted';
type UserRole = 'Student' | 'VA' | 'Print Center' | 'Admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateRegistered: string;
  status: UserStatus;
  tasksSubmitted?: number;
  lastLogin: string;
  subscriptionPlan?: string;
  isEmailVerified: boolean;
  phone?: string;
}

const initialUsers: User[] = [
  { id: "USR001", name: "John Doe", email: "john.doe@example.com", role: "Student", dateRegistered: "2024-07-15", status: "Active", tasksSubmitted: 5, lastLogin: "2024-07-20", subscriptionPlan: "Pro", isEmailVerified: true, phone: "0801234567" },
  { id: "USR002", name: "Alice Smith", email: "alice.smith@example.com", role: "Student", dateRegistered: "2024-07-14", status: "Active", tasksSubmitted: 2, lastLogin: "2024-07-19", subscriptionPlan: "Basic", isEmailVerified: true, phone: "0802345678" },
  { id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", role: "Student", dateRegistered: "2024-07-13", status: "Suspended", tasksSubmitted: 10, lastLogin: "2024-07-10", isEmailVerified: false },
  { id: "USR004", name: "Eva Williams", email: "eva.williams@example.com", role: "Student", dateRegistered: "2024-06-20", status: "Pending Approval", tasksSubmitted: 0, lastLogin: "N/A", isEmailVerified: false },
  { id: "VA001", name: "Aisha Bello", email: "aisha.va@example.com", role: "VA", dateRegistered: "2024-07-01", status: "Active", lastLogin: "2024-07-21", subscriptionPlan: "Professional Business VA", isEmailVerified: true, phone: "0701122334" },
  { id: "PC001", name: "Speedy Prints", email: "speedy@prints.com", role: "Print Center", dateRegistered: "2024-06-15", status: "Active", lastLogin: "2024-07-22", isEmailVerified: true, phone: "0909876543" },
];

const statusColors: Record<UserStatus, string> = {
  "Active": "bg-green-100 text-green-700 border-green-300",
  "Suspended": "bg-red-100 text-red-700 border-red-300",
  "Pending Approval": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Deleted": "bg-gray-100 text-gray-700 border-gray-300",
};

const roleColors: Record<UserRole, string> = {
  "Student": "bg-blue-100 text-blue-700 border-blue-300",
  "VA": "bg-purple-100 text-purple-700 border-purple-300",
  "Print Center": "bg-teal-100 text-teal-700 border-teal-300",
  "Admin": "bg-slate-100 text-slate-700 border-slate-300",
};

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole && user.status !== 'Deleted';
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsViewDetailsOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // For now, this just opens a placeholder.
    // In a real app, you'd populate a form with user data.
    setIsEditUserOpen(true); 
  };
  
  const handleCreateUser = (newUser: Omit<User, 'id' | 'dateRegistered' | 'lastLogin' | 'isEmailVerified' | 'status' >) => {
    const newId = `${newUser.role.substring(0,2).toUpperCase()}${String(Date.now()).slice(-4)}`;
    setUsers(prev => [...prev, {
      ...newUser,
      id: newId,
      dateRegistered: new Date().toISOString().split('T')[0],
      lastLogin: "N/A",
      isEmailVerified: false, // Or true if email verification is part of creation
      status: "Active", // Or "Pending Approval" if admin needs to approve manually created users
    }]);
    toast({
      title: "User Created Successfully",
      description: `Account for ${newUser.name} created. Simulated email notification sent.`,
    });
    setIsCreateUserOpen(false);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Suspended" } : u));
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Suspended",
      description: `User ${user?.name || userId} has been suspended. Simulated email notification sent.`,
      variant: "destructive",
    });
  };

  const handleUnsuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Active" } : u));
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Unsuspended",
      description: `User ${user?.name || userId} has been reactivated. Simulated email notification sent.`,
    });
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    // Or set status to "Deleted" if soft delete:
    // setUsers(prev => prev.map(u => u.id === userToDelete.id ? { ...u, status: "Deleted" } : u));
    toast({
      title: "User Deleted",
      description: `User ${userToDelete.name} has been deleted. Simulated email notification sent.`,
      variant: "destructive",
    });
    setUserToDelete(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Users"
        description="View, edit, create, and manage all user accounts on the platform."
        icon={BookUser}
        actions={
            <Button onClick={() => setIsCreateUserOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4"/> Create New User
            </Button>
        }
      />
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="font-headline">All Users ({filteredUsers.length})</CardTitle>
                <CardDescription>Search, filter, and manage user accounts.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by ID, name, email..." 
                        className="pl-8 w-full sm:w-64" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {Object.keys(roleColors).map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                         {Object.keys(statusColors).filter(s => s !== 'Deleted').map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <UserCircle2 className="mx-auto h-12 w-12 mb-3" />
                <p>No users match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("text-xs", roleColors[user.role])}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusColors[user.status])}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.dateRegistered}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">User Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit3 className="mr-2 h-4 w-4" /> Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "Active" && (
                                    <DropdownMenuItem onClick={() => handleSuspendUser(user.id)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                                        <ShieldAlert className="mr-2 h-4 w-4" /> Suspend Account
                                    </DropdownMenuItem>
                                )}
                                {user.status === "Suspended" && (
                                    <DropdownMenuItem onClick={() => handleUnsuspendUser(user.id)} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Unsuspend Account
                                    </DropdownMenuItem>
                                )}
                                 {user.status !== "Pending Approval" && (
                                    <DropdownMenuItem onClick={() => confirmDeleteUser(user)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                    </DropdownMenuItem>
                                 )}
                                {user.status === "Pending Approval" && (
                                     <DropdownMenuItem onClick={() => { /* Placeholder for approve action -> redirects to approvals page or directly handles */ toast({title: "Redirecting", description: "Please use the Account Approvals page for pending users."}) }} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Review Approval
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
         <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
                Total active users: {users.filter(u => u.status === 'Active').length}. 
                Total pending approval: {users.filter(u => u.status === 'Pending Approval').length}.
            </p>
        </CardFooter>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User Account</DialogTitle>
            <DialogDescription>
              Fill in the details to manually create a new user. An email notification will be simulated.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateUser({
                name: formData.get("newUserName") as string,
                email: formData.get("newUserEmail") as string,
                role: formData.get("newUserRole") as UserRole,
                // Password handling is backend, this is just for UI demo
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="newUserName">Full Name</Label>
                <Input id="newUserName" name="newUserName" placeholder="John Doe" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newUserEmail">Email Address</Label>
                <Input id="newUserEmail" name="newUserEmail" type="email" placeholder="user@example.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newUserRole">User Role</Label>
                <Select name="newUserRole" defaultValue="Student" required>
                    <SelectTrigger id="newUserRole">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="VA">Virtual Assistant (VA)</SelectItem>
                        <SelectItem value="Print Center">Print Center</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-1.5">
                <Label htmlFor="newUserPassword">Password (Simulated)</Label>
                <Input id="newUserPassword" name="newUserPassword" type="password" placeholder="Enter a strong password" required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
                <UserCircle2 className="mr-2 h-6 w-6 text-primary"/> User Details: {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              ID: {selectedUser?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><strong className="text-muted-foreground">Full Name:</strong> {selectedUser.name}</div>
                    <div><strong className="text-muted-foreground">Email:</strong> {selectedUser.email}</div>
                    <div><strong className="text-muted-foreground">Role:</strong> <Badge variant="outline" className={cn("text-xs", roleColors[selectedUser.role])}>{selectedUser.role}</Badge></div>
                    <div><strong className="text-muted-foreground">Status:</strong> <Badge variant="outline" className={cn("text-xs", statusColors[selectedUser.status])}>{selectedUser.status}</Badge></div>
                    <div><strong className="text-muted-foreground">Registered:</strong> {selectedUser.dateRegistered}</div>
                    <div><strong className="text-muted-foreground">Last Login:</strong> {selectedUser.lastLogin}</div>
                    {selectedUser.phone && <div><strong className="text-muted-foreground">Phone:</strong> {selectedUser.phone}</div>}
                    {selectedUser.subscriptionPlan && <div><strong className="text-muted-foreground">Subscription:</strong> {selectedUser.subscriptionPlan}</div>}
                    <div><strong className="text-muted-foreground">Email Verified:</strong> {selectedUser.isEmailVerified ? <Verified className="inline h-4 w-4 text-green-600" /> : <XCircle className="inline h-4 w-4 text-red-600" />}</div>
                    {selectedUser.role === 'Student' && selectedUser.tasksSubmitted !== undefined && <div><strong className="text-muted-foreground">Tasks Submitted:</strong> {selectedUser.tasksSubmitted}</div>}
                </div>
                 <div className="border-t pt-3 mt-2">
                    <h4 className="font-medium mb-2 text-primary">Admin Actions (from here)</h4>
                    <div className="flex gap-2">
                       {selectedUser.status === "Active" && (
                            <Button size="sm" variant="outline" onClick={() => {handleSuspendUser(selectedUser.id); setIsViewDetailsOpen(false);}} className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700">
                                <ShieldAlert className="mr-1 h-4 w-4" /> Suspend
                            </Button>
                        )}
                        {selectedUser.status === "Suspended" && (
                             <Button size="sm" variant="outline" onClick={() => {handleUnsuspendUser(selectedUser.id); setIsViewDetailsOpen(false);}} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                                <ShieldCheck className="mr-1 h-4 w-4" /> Unsuspend
                            </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => {confirmDeleteUser(selectedUser); setIsViewDetailsOpen(false);}}>
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog (Placeholder) */}
       <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
                <DialogDescription>User editing functionality is under development. This is a placeholder.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-muted-foreground">
                <Edit3 className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p>Detailed user editing form will appear here.</p>
            </div>
            <DialogFooter>
                 <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
       </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                <AlertDialogDescription>
                    User: <strong>{userToDelete?.name}</strong> (ID: {userToDelete?.id}, Email: {userToDelete?.email})
                    <br/>This action cannot be undone. The user's data will be permanently removed (or marked as deleted).
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete User</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
