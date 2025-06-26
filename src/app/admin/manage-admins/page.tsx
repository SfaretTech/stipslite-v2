
"use client";

import { useState, useMemo } from "react";
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
  DialogClose,
  DialogTrigger,
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
import { UserCog, Search, Edit3, Trash2, UserPlus, MoreHorizontal, ShieldCheck, ShieldAlert, Settings, CheckCircle, XCircle, Banknote, Megaphone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


type AdminRole = 'General Admin' | 'Full Admin' | 'Support Admin' | 'Content Admin';
type AdminStatus = 'Active' | 'Inactive';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLogin: string; // Simulated
  featureAccess: Record<string, boolean>; // e.g., { canManageUsers: true, canManageSettings: false }
}

const initialAdminUsers: AdminUser[] = [
  { id: "ADM001", name: "General Admin", email: "admin@sfaret", role: "General Admin", status: "Active", lastLogin: "2024-07-25", featureAccess: { all: true } },
  { id: "ADM002", name: "Support Lead", email: "support.lead@stipslite.com", role: "Support Admin", status: "Active", lastLogin: "2024-07-24", featureAccess: { manageSupportTickets: true, viewUsers: true } },
  { id: "ADM003", name: "Content Manager", email: "content.mgr@stipslite.com", role: "Content Admin", status: "Inactive", lastLogin: "2024-07-20", featureAccess: { manageAnnouncements: true } },
];

const availableRoles: AdminRole[] = ['Full Admin', 'Support Admin', 'Content Admin'];

const mockFeatures = [
    { id: "manageUsers", label: "Manage Users" },
    { id: "manageTasks", label: "Manage Task Approvals" },
    { id: "manageApprovals", label: "Manage Account Approvals" },
    { id: "managePaymentWithdrawals", label: "Manage Payment Withdrawals", icon: Banknote },
    { id: "manageAnnouncements", label: "Manage Announcements", icon: Megaphone },
    { id: "manageSupportTickets", label: "Manage Support Tickets", icon: MessageSquare },
    { id: "manageSettings", label: "Manage Platform Settings" },
    { id: "manageAdmins", label: "Manage Other Admins" },
    { id: "viewFinancials", label: "View Financial Reports" },
];


export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdminUsers);
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [isEditAdminDialogOpen, setIsEditAdminDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole | undefined>();

  const { toast } = useToast();

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminRole) {
        toast({title: "Missing Fields", description: "Please fill in all required admin details.", variant: "destructive"});
        return;
    }
    const newAdmin: AdminUser = {
      id: `ADM${String(Date.now()).slice(-4)}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      status: "Active",
      lastLogin: "Never",
      featureAccess: newAdminRole === "Full Admin" ? { all: true } : {}, // Default permissions
    };
    setAdmins(prev => [...prev, newAdmin]);
    toast({ title: "Admin Added", description: `${newAdminName} has been added as a ${newAdminRole}. Simulated email sent.` });
    setIsAddAdminDialogOpen(false);
    setNewAdminName(""); setNewAdminEmail(""); setNewAdminRole(undefined);
  };

  const handleToggleStatus = (adminId: string) => {
    setAdmins(prevAdmins =>
      prevAdmins.map(admin =>
        admin.id === adminId
          ? { ...admin, status: admin.status === "Active" ? "Inactive" : "Active" }
          : admin
      )
    );
    const admin = admins.find(a => a.id === adminId);
    toast({ title: "Admin Status Updated", description: `${admin?.name}'s status changed to ${admin?.status === "Active" ? "Inactive" : "Active"}.` });
  };

  const confirmDeleteAdmin = (admin: AdminUser) => {
    if (admin.role === "General Admin") {
        toast({ title: "Action Not Allowed", description: "The General Admin account cannot be deleted.", variant: "destructive"});
        return;
    }
    setAdminToDelete(admin);
  };

  const handleDeleteAdmin = () => {
    if (!adminToDelete) return;
    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminToDelete.id));
    toast({ title: "Admin Deleted", description: `${adminToDelete.name} has been removed.`, variant: "destructive" });
    setAdminToDelete(null);
  };
  
  const handleOpenEditDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    // Populate edit form states if implementing full edit
    setIsEditAdminDialogOpen(true);
  };

  const handleOpenPermissionsDialog = (admin: AdminUser) => {
    if (admin.role === "General Admin") {
        toast({ title: "Not Applicable", description: "The General Admin has all permissions by default.", variant: "default"});
        return;
    }
    setSelectedAdmin(admin);
    setIsPermissionsDialogOpen(true);
  };

  const handleSavePermissions = (adminId: string, newPermissions: Record<string, boolean>) => {
    setAdmins(prevAdmins => 
        prevAdmins.map(admin => admin.id === adminId ? {...admin, featureAccess: newPermissions} : admin)
    );
    toast({title: "Permissions Updated", description: `Permissions for ${selectedAdmin?.name} have been updated.`});
    setIsPermissionsDialogOpen(false);
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Administrators"
        description="Add, view, and configure admin accounts and their permissions."
        icon={UserCog}
        actions={
            <Button onClick={() => setIsAddAdminDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <UserPlus className="mr-2 h-4 w-4"/> Add New Admin
            </Button>
        }
      />

      {/* Add New Admin Dialog */}
      <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddAdmin}>
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
              <DialogDescription>Fill in the details for the new admin account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="newAdminName">Full Name</Label>
                <Input id="newAdminName" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newAdminEmail">Email Address</Label>
                <Input id="newAdminEmail" type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="admin.user@stipslite.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newAdminPassword">Password (Temporary)</Label>
                <Input id="newAdminPassword" type="password" placeholder="Set a strong temporary password" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newAdminRole">Admin Role</Label>
                <Select onValueChange={(value) => setNewAdminRole(value as AdminRole)} value={newAdminRole} required>
                  <SelectTrigger id="newAdminRole"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Add Admin</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Admin Dialog (Placeholder/Basic) */}
      <Dialog open={isEditAdminDialogOpen} onOpenChange={setIsEditAdminDialogOpen}>
          <DialogContent>
            {selectedAdmin && (
              <>
                  <DialogHeader>
                      <DialogTitle>Edit Admin: {selectedAdmin.name}</DialogTitle>
                      <DialogDescription>Modify admin details. (This is a simplified version).</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <div className="space-y-1.5">
                          <Label htmlFor="editAdminName">Full Name</Label>
                          <Input id="editAdminName" defaultValue={selectedAdmin.name} />
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="editAdminEmail">Email Address</Label>
                          <Input id="editAdminEmail" type="email" defaultValue={selectedAdmin.email} readOnly={selectedAdmin.role === "General Admin"} />
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="editAdminRole">Admin Role</Label>
                          <Select defaultValue={selectedAdmin.role} disabled={selectedAdmin.role === "General Admin"}>
                              <SelectTrigger id="editAdminRole"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  {selectedAdmin.role === "General Admin" ? <SelectItem value="General Admin">General Admin</SelectItem> : availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button onClick={() => {setIsEditAdminDialogOpen(false); toast({title:"Changes Saved (Simulated)"})}}>Save Changes</Button>
                  </DialogFooter>
              </>
            )}
          </DialogContent>
      </Dialog>

      {/* Configure Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedAdmin && selectedAdmin.role !== "General Admin" && (
              <>
                  <DialogHeader>
                      <DialogTitle>Configure Permissions for {selectedAdmin.name}</DialogTitle>
                      <DialogDescription>
                          Manage granular feature access for {selectedAdmin.name} ({selectedAdmin.role}).
                          These settings complement their assigned role.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
                      {mockFeatures.map(feature => {
                          const Icon = feature.icon;
                          return (
                              <div key={feature.id} className="flex items-center justify-between p-3 border rounded-md">
                                  <Label htmlFor={`perm-${feature.id}`} className="text-sm flex items-center">
                                      {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
                                      {feature.label}
                                  </Label>
                                  <Switch 
                                      id={`perm-${feature.id}`}
                                      checked={selectedAdmin.featureAccess[feature.id] || selectedAdmin.featureAccess.all || false}
                                      onCheckedChange={(checked) => {
                                          setSelectedAdmin(prev => prev ? {
                                              ...prev, 
                                              featureAccess: {...prev.featureAccess, all: false, [feature.id]: checked}
                                          } : null);
                                      }}
                                  />
                              </div>
                          );
                      })}
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button onClick={() => handleSavePermissions(selectedAdmin.id, selectedAdmin.featureAccess)}>Save Permissions</Button>
                  </DialogFooter>
              </>
            )}
          </DialogContent>
      </Dialog>


      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Existing Administrators ({admins.length})</CardTitle>
          <CardDescription>View and manage current admin accounts.</CardDescription>
        </CardHeader>
        <CardContent>
            {admins.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    <UserCog className="mx-auto h-12 w-12 mb-3"/>
                    <p>No additional admin accounts configured yet.</p>
                </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Feature Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map(admin => {
                      let featureAccessText = "Standard (Role Defaults)";
                      if (admin.featureAccess.all) {
                        featureAccessText = "All Features";
                      } else {
                        const grantedPermissions = Object.entries(admin.featureAccess)
                          .filter(([key, value]) => value && key !== 'all')
                          .map(([key]) => {
                            const feature = mockFeatures.find(f => f.id === key);
                            return feature ? feature.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
                          })
                          .join(', ');
                        if (grantedPermissions) {
                          featureAccessText = grantedPermissions;
                        }
                      }
                      return (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell><Badge variant={admin.role === "General Admin" ? "default" : "secondary"}>{admin.role}</Badge></TableCell>
                          <TableCell>
                            <Badge variant={admin.status === "Active" ? "outline" : "destructive"} className={cn(admin.status === "Active" ? "text-green-600 border-green-600" : "")}>
                              {admin.status === "Active" ? <CheckCircle className="mr-1 h-3.5 w-3.5"/> : <XCircle className="mr-1 h-3.5 w-3.5"/>}
                              {admin.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">
                            {featureAccessText}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" /><span className="sr-only">Admin Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenEditDialog(admin)}>
                                  <Edit3 className="mr-2 h-4 w-4" /> Edit Details
                                </DropdownMenuItem>
                                {admin.role !== "General Admin" && (
                                  <>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(admin.id)}>
                                      {admin.status === "Active" ? <ShieldAlert className="mr-2 h-4 w-4 text-orange-600" /> : <ShieldCheck className="mr-2 h-4 w-4 text-green-600" />}
                                      {admin.status === "Active" ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenPermissionsDialog(admin)}>
                                      <Settings className="mr-2 h-4 w-4" /> Configure Permissions
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => confirmDeleteAdmin(admin)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete Admin
                                  </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
        </CardContent>
      </Card>

      <AlertDialog open={!!adminToDelete} onOpenChange={() => setAdminToDelete(null)}>
        <AlertDialogContent>
          {adminToDelete && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete Administrator</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete admin: <strong>{adminToDelete.name}</strong> ({adminToDelete.email})? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAdminToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAdmin} className="bg-destructive hover:bg-destructive/90">Delete Admin</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
