
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, DollarSign, Percent, Gift, Users2, Building, Briefcase, ClipboardList, Radio, Edit3, Trash2, PlusCircle, Palette, CreditCardIcon, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


interface TaskPricingConfig {
  id: string;
  taskTypeName: string;
  feeRangeNGN: string;
  feeRangeUSD?: string;
  pricingModel: "per_page" | "fixed";
  pricePerPageNGN?: number | null;
  fixedPriceNGN?: number | null;
  notes?: string;
  isActive: boolean;
}

const INITIAL_TASK_PRICING_CONFIG: TaskPricingConfig[] = [
  { id: "task_assign_1", taskTypeName: "Assignment", feeRangeNGN: "2000", feeRangeUSD: "5", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_term_paper", taskTypeName: "Term Paper", feeRangeNGN: "3000 - 5000", feeRangeUSD: "5-8", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_project_work", taskTypeName: "Project Work", feeRangeNGN: "7000 - 15000", feeRangeUSD: "", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_research_paper", taskTypeName: "Research Paper", feeRangeNGN: "2000 - 4000", feeRangeUSD: "3-6", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_assign_2", taskTypeName: "Assignment (Type 2)", feeRangeNGN: "1000 - 2000", feeRangeUSD: "2-4", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_essay", taskTypeName: "Essay Writing", feeRangeNGN: "2000", feeRangeUSD: "5", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_thesis", taskTypeName: "Thesis", feeRangeNGN: "15000 - 40000", feeRangeUSD: "30", pricingModel: "per_page", pricePerPageNGN: 300, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_dissertation", taskTypeName: "Dissertation", feeRangeNGN: "7000 - 15000", feeRangeUSD: "", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_coursework", taskTypeName: "Coursework", feeRangeNGN: "2000 - 4000", feeRangeUSD: "3-6", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_group_project", taskTypeName: "Group Project", feeRangeNGN: "1000 - 2000", feeRangeUSD: "2-4", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_review", taskTypeName: "Book/Article Review", feeRangeNGN: "2000", feeRangeUSD: "3-6", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_bibliography", taskTypeName: "Annotated Bibliography", feeRangeNGN: "2000", feeRangeUSD: "5", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_lit_review", taskTypeName: "Literature Review", feeRangeNGN: "3000 - 5000", feeRangeUSD: "5-8", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_field_report", taskTypeName: "Field Work Report", feeRangeNGN: "7000 - 15000", feeRangeUSD: "", pricingModel: "per_page", pricePerPageNGN: 200, fixedPriceNGN: null, notes: "", isActive: true },
  { id: "task_seminar_paper", taskTypeName: "Seminar Paper", feeRangeNGN: "1000", feeRangeUSD: "", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 1000, notes: "", isActive: true },
  { id: "task_intern_report", taskTypeName: "Internship Report", feeRangeNGN: "1000 - 2000", feeRangeUSD: "10", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 1000, notes: "", isActive: true },
  { id: "task_position_paper", taskTypeName: "Position Paper", feeRangeNGN: "2000", feeRangeUSD: "5", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 2000, notes: "", isActive: true },
  { id: "task_concept_note", taskTypeName: "Concept Note / Proposal Writing", feeRangeNGN: "2000 - 7000", feeRangeUSD: "20", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 2000, notes: "", isActive: true },
  { id: "task_abstract", taskTypeName: "Abstract Writing", feeRangeNGN: "1000", feeRangeUSD: "2-4", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 1000, notes: "", isActive: true },
  { id: "task_business_plan", taskTypeName: "Business Plan / Feasibility Study", feeRangeNGN: "25000", feeRangeUSD: "30-60", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 25000, notes: "", isActive: true },
  { id: "task_debate_prep", taskTypeName: "Academic Debate Preparation", feeRangeNGN: "Coming soon", feeRangeUSD: "", pricingModel: "fixed", pricePerPageNGN: null, fixedPriceNGN: 0, notes: "Pricing coming soon", isActive: true },
  { id: "task_mock_exam", taskTypeName: "Mock/ Exam Questions setup", feeRangeNGN: "1000", feeRangeUSD: "", pricingModel: "per_page", pricePerPageNGN: 500, fixedPriceNGN: null, notes: "", isActive: true }
];

const emptyTaskConfig: Omit<TaskPricingConfig, 'id' | 'isActive'> = {
  taskTypeName: "", feeRangeNGN: "", feeRangeUSD: "", pricingModel: "per_page", pricePerPageNGN: null, fixedPriceNGN: null, notes: "",
};


type UserRoleTarget = 'student' | 'va' | 'print-center';

interface SubscriptionTierConfig {
  id: string;
  name: string;
  description: string;
  priceMonthlyNGN: number | null;
  priceYearlyNGN: number | null;
  currency: string;
  targetUserRoles: UserRoleTarget[];
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
}

const INITIAL_SUBSCRIPTION_TIERS: SubscriptionTierConfig[] = [
  {
    id: "expert_va_student", name: "Student Expert VA Plan", description: "Allows students to request specific VAs.",
    priceMonthlyNGN: 500, priceYearlyNGN: 5000, currency: "NGN",
    targetUserRoles: ["student"], features: ["Request specific VAs", "Priority VA assignment", "Direct VA messaging (soon)"],
    isActive: true, isPopular: true,
  },
  {
    id: "va_professional_business", name: "VA Professional Business Plan", description: "Premium features for VAs.",
    priceMonthlyNGN: 1000, priceYearlyNGN: 10000, currency: "NGN",
    targetUserRoles: ["va"], features: ["Premium Profile Listing", "Access Business Service Tasks", "Advanced Analytics (soon)"],
    isActive: true, isPopular: true,
  },
  {
    id: "ads_blocker_all", name: "Ads Blocker (All Users)", description: "Enjoy an ad-free experience.",
    priceMonthlyNGN: 200, priceYearlyNGN: 2000, currency: "NGN",
    targetUserRoles: ["student", "va", "print-center"], features: ["Remove all ads", "Cleaner browsing", "Support platform"],
    isActive: true, isPopular: false,
  },
];

const emptySubscriptionTier: Omit<SubscriptionTierConfig, 'id'> = {
  name: "", description: "", priceMonthlyNGN: null, priceYearlyNGN: null, currency: "NGN",
  targetUserRoles: [], features: [], isActive: true, isPopular: false,
};

const userRoleOptions: { id: UserRoleTarget; label: string }[] = [
    { id: 'student', label: 'Student Users' },
    { id: 'va', label: 'Virtual Assistants (VAs)' },
    { id: 'print-center', label: 'Print Centers' },
];


export default function AdminSettingsPage() {
  const { toast } = useToast();
  
  // Task Pricing State
  const [taskConfigs, setTaskConfigs] = useState<TaskPricingConfig[]>(INITIAL_TASK_PRICING_CONFIG);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTaskConfig, setCurrentTaskConfig] = useState<Omit<TaskPricingConfig, 'id' | 'isActive'>>(emptyTaskConfig);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Subscription Tier State
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierConfig[]>(INITIAL_SUBSCRIPTION_TIERS);
  const [isSubTierDialogOpen, setIsSubTierDialogOpen] = useState(false);
  const [currentSubTier, setCurrentSubTier] = useState<Omit<SubscriptionTierConfig, 'id'>>(emptySubscriptionTier);
  const [editingSubTierId, setEditingSubTierId] = useState<string | null>(null);


  // Task Pricing Handlers
  const handleAddNewTaskType = () => {
    setCurrentTaskConfig(emptyTaskConfig);
    setEditingTaskId(null);
    setIsTaskDialogOpen(true);
  };
  
  const handleEditTaskType = (task: TaskPricingConfig) => {
    setCurrentTaskConfig({ ...task });
    setEditingTaskId(task.id);
    setIsTaskDialogOpen(true); // Use same dialog, but could be setIsTaskEditDialogOpen if different
  };

  const handleSaveTaskConfig = () => {
    if (!currentTaskConfig.taskTypeName.trim()) {
        toast({title: "Task Type Name Required", description: "Please enter a name for the task type.", variant: "destructive"});
        return;
    }
    if (editingTaskId) {
        setTaskConfigs(prev => prev.map(task => task.id === editingTaskId ? { ...currentTaskConfig, id: editingTaskId, isActive: task.isActive } as TaskPricingConfig : task));
        toast({title: "Task Type Updated", description: `${currentTaskConfig.taskTypeName} has been updated.`});
    } else {
        const newTask: TaskPricingConfig = { ...currentTaskConfig, id: `task_${Date.now()}`, isActive: true };
        setTaskConfigs(prev => [...prev, newTask]);
        toast({title: "Task Type Added", description: `${currentTaskConfig.taskTypeName} has been added.`});
    }
    setIsTaskDialogOpen(false);
    setCurrentTaskConfig(emptyTaskConfig);
    setEditingTaskId(null);
  };
  
  const handleToggleTaskStatus = (taskId: string, isActive: boolean) => {
    setTaskConfigs(prev => prev.map(task => task.id === taskId ? { ...task, isActive } : task));
    const taskName = taskConfigs.find(t => t.id === taskId)?.taskTypeName;
    toast({ title: `Task Type ${isActive ? 'Activated' : 'Deactivated'}`, description: `${taskName || 'Task'} is now ${isActive ? 'active' : 'inactive'}.` });
  };


  // Subscription Tier Handlers
  const handleAddNewSubTier = () => {
    setCurrentSubTier(emptySubscriptionTier);
    setEditingSubTierId(null);
    setIsSubTierDialogOpen(true);
  };

  const handleEditSubTier = (tier: SubscriptionTierConfig) => {
    setCurrentSubTier({ ...tier });
    setEditingSubTierId(tier.id);
    setIsSubTierDialogOpen(true);
  };

  const handleSaveSubTier = () => {
    if (!currentSubTier.name.trim()) {
        toast({title: "Subscription Name Required", description: "Please enter a name for the subscription tier.", variant: "destructive"});
        return;
    }
    if (editingSubTierId) {
        setSubscriptionTiers(prev => prev.map(tier => tier.id === editingSubTierId ? { ...currentSubTier, id: editingSubTierId, isActive: currentSubTier.isActive } as SubscriptionTierConfig : tier));
        toast({title: "Subscription Tier Updated", description: `${currentSubTier.name} has been updated.`});
    } else {
        const newTier: SubscriptionTierConfig = { ...currentSubTier, id: `sub_${Date.now()}` };
        setSubscriptionTiers(prev => [...prev, newTier]);
        toast({title: "Subscription Tier Added", description: `${currentSubTier.name} has been added.`});
    }
    setIsSubTierDialogOpen(false);
    setEditingSubTierId(null);
  };

  const handleToggleSubTierStatus = (tierId: string, isActive: boolean) => {
    setSubscriptionTiers(prev => prev.map(tier => tier.id === tierId ? { ...tier, isActive } : tier));
    const tierName = subscriptionTiers.find(t => t.id === tierId)?.name;
    toast({ title: `Subscription Tier ${isActive ? 'Activated' : 'Deactivated'}`, description: `${tierName || 'Tier'} is now ${isActive ? 'active' : 'inactive'}. This will affect its visibility to users.` });
  };
  
  const handleSubTierTargetRoleChange = (role: UserRoleTarget, checked: boolean) => {
    setCurrentSubTier(prev => {
      const newRoles = checked 
        ? [...prev.targetUserRoles, role] 
        : prev.targetUserRoles.filter(r => r !== role);
      return { ...prev, targetUserRoles: newRoles };
    });
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings Saved (Simulated)", description: "All platform settings have been saved." });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Platform Settings" description="Manage general settings, payments, task pricing, subscriptions, referrals, and ads." icon={Settings} />
      
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="font-headline">General Settings</CardTitle><CardDescription>Basic platform configuration.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="platformName">Platform Name</Label><Input id="platformName" defaultValue="STIPS Lite" /></div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5"><Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label><p className="text-sm text-muted-foreground">Temporarily disable user access.</p></div>
              <Switch id="maintenanceMode" aria-label="Toggle maintenance mode" />
            </div>
            <div className="space-y-1.5"><Label htmlFor="supportEmail">Support Email</Label><Input id="supportEmail" type="email" defaultValue="support@stipslite.com" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline flex items-center"><CreditCardIcon className="mr-2 h-5 w-5 text-primary"/>Subscription Tier Management</CardTitle>
              <CardDescription>Define and manage subscription plans available on the platform.</CardDescription>
            </div>
            <Button type="button" onClick={handleAddNewSubTier} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4"/> Add New Tier
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionTiers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No subscription tiers configured. Click "Add New Tier" to begin.</p>
            ) : (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tier Name</TableHead>
                            <TableHead>Price (Monthly/Yearly NGN)</TableHead>
                            <TableHead>Target Roles</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptionTiers.map((tier) => (
                            <TableRow key={tier.id}>
                                <TableCell className="font-medium">{tier.name}</TableCell>
                                <TableCell>₦{tier.priceMonthlyNGN || 'N/A'} / ₦{tier.priceYearlyNGN || 'N/A'}</TableCell>
                                <TableCell className="space-x-1">
                                    {tier.targetUserRoles.map(role => <Badge key={role} variant="outline">{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Switch id={`tier-status-${tier.id}`} checked={tier.isActive} onCheckedChange={(checked) => handleToggleSubTierStatus(tier.id, checked)}/>
                                      <Label htmlFor={`tier-status-${tier.id}`} className="text-xs">{tier.isActive ? 'Active' : 'Inactive'}</Label>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleEditSubTier(tier)}><Edit3 className="mr-1 h-3.5 w-3.5"/> Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            )}
            <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md flex items-center gap-2 mt-4">
              <Info className="h-4 w-4 shrink-0 text-blue-600" />
              <span>Actual payment processing and plan enforcement are handled via Flutterwave integration (backend). Admin configurations define available plans and pricing.</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Subscription Tier Dialog */}
        <Dialog open={isSubTierDialogOpen} onOpenChange={setIsSubTierDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingSubTierId ? "Edit" : "Add New"} Subscription Tier</DialogTitle>
                    <DialogDescription>{editingSubTierId ? "Modify details for this tier." : "Define a new subscription tier."}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-3">
                    <div className="space-y-1.5"><Label htmlFor="subTierName">Tier Name</Label><Input id="subTierName" value={currentSubTier.name} onChange={(e) => setCurrentSubTier(p => ({...p, name: e.target.value}))} required /></div>
                    <div className="space-y-1.5"><Label htmlFor="subTierDesc">Description</Label><Textarea id="subTierDesc" value={currentSubTier.description} onChange={(e) => setCurrentSubTier(p => ({...p, description: e.target.value}))} rows={2} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label htmlFor="subPriceMonthly">Price Monthly (NGN)</Label><Input id="subPriceMonthly" type="number" value={currentSubTier.priceMonthlyNGN ?? ""} onChange={(e) => setCurrentSubTier(p => ({...p, priceMonthlyNGN: e.target.value ? parseFloat(e.target.value) : null}))} /></div>
                        <div className="space-y-1.5"><Label htmlFor="subPriceYearly">Price Yearly (NGN)</Label><Input id="subPriceYearly" type="number" value={currentSubTier.priceYearlyNGN ?? ""} onChange={(e) => setCurrentSubTier(p => ({...p, priceYearlyNGN: e.target.value ? parseFloat(e.target.value) : null}))} /></div>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="subCurrency">Currency</Label><Input id="subCurrency" value={currentSubTier.currency} onChange={(e) => setCurrentSubTier(p => ({...p, currency: e.target.value}))} defaultValue="NGN" /></div>
                    <div className="space-y-2">
                        <Label>Target User Roles</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {userRoleOptions.map(roleOpt => (
                                <div key={roleOpt.id} className="flex items-center space-x-2 p-2 border rounded-md">
                                    <Checkbox 
                                        id={`role-${roleOpt.id}`} 
                                        checked={currentSubTier.targetUserRoles.includes(roleOpt.id)}
                                        onCheckedChange={(checked) => handleSubTierTargetRoleChange(roleOpt.id, !!checked)}
                                    />
                                    <Label htmlFor={`role-${roleOpt.id}`} className="font-normal text-sm">{roleOpt.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="subFeatures">Features (one per line)</Label><Textarea id="subFeatures" value={currentSubTier.features.join('\n')} onChange={(e) => setCurrentSubTier(p => ({...p, features: e.target.value.split('\n')}))} rows={4} /></div>
                    <div className="flex items-center justify-between rounded-lg border p-3 mt-2">
                        <Label htmlFor="subIsActive" className="text-sm">Tier Active (Visible to users)</Label>
                        <Switch id="subIsActive" checked={currentSubTier.isActive} onCheckedChange={(checked) => setCurrentSubTier(p => ({...p, isActive: checked}))} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label htmlFor="subIsPopular" className="text-sm">Mark as Popular</Label>
                        <Switch id="subIsPopular" checked={currentSubTier.isPopular ?? false} onCheckedChange={(checked) => setCurrentSubTier(p => ({...p, isPopular: checked}))} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline" onClick={() => { setIsSubTierDialogOpen(false); }}>Cancel</Button></DialogClose>
                    <Button onClick={handleSaveSubTier}>Save {editingSubTierId ? "Changes" : "Tier"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary"/>Task Pricing &amp; Configuration</CardTitle>
              <CardDescription>Define task types, their pricing models, fees, and active status.</CardDescription>
            </div>
            <Button type="button" onClick={handleAddNewTaskType} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4"/> Add New Task Type
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskConfigs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No task types configured yet. Click "Add New Task Type" to begin.</p>
            ) : (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader><TableRow><TableHead>Task Type Name</TableHead><TableHead>Fee Range (NGN/USD)</TableHead><TableHead>Pricing</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {taskConfigs.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.taskTypeName}</TableCell>
                                <TableCell>{task.feeRangeNGN}{task.feeRangeUSD ? ` / ${task.feeRangeUSD}` : ''}</TableCell>
                                <TableCell>{task.pricingModel === 'per_page' ? `Per Page: ₦${task.pricePerPageNGN || 0}` : `Fixed: ₦${task.fixedPriceNGN || 0}`}</TableCell>
                                <TableCell><div className="flex items-center space-x-2"><Switch id={`task-status-${task.id}`} checked={task.isActive} onCheckedChange={(checked) => handleToggleTaskStatus(task.id, checked)}/><Label htmlFor={`task-status-${task.id}`} className="text-xs">{task.isActive ? 'Active' : 'Inactive'}</Label></div></TableCell>
                                <TableCell className="text-xs max-w-xs truncate">{task.notes || '-'}</TableCell>
                                <TableCell><Button variant="outline" size="sm" onClick={() => handleEditTaskType(task)}><Edit3 className="mr-1 h-3.5 w-3.5"/> Edit</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>{editingTaskId ? "Edit" : "Add New"} Task Type</DialogTitle><DialogDescription>{editingTaskId ? "Modify details." : "Define a new task type."}</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-1.5"><Label htmlFor="taskTypeNameEdit">Task Type Name</Label><Input id="taskTypeNameEdit" value={currentTaskConfig.taskTypeName} onChange={(e) => setCurrentTaskConfig(p => ({...p, taskTypeName: e.target.value}))} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label htmlFor="feeRangeNGNEdit">Fee Range (NGN)</Label><Input id="feeRangeNGNEdit" value={currentTaskConfig.feeRangeNGN} onChange={(e) => setCurrentTaskConfig(p => ({...p, feeRangeNGN: e.target.value}))} /></div>
                        <div className="space-y-1.5"><Label htmlFor="feeRangeUSDEdit">Fee Range (USD)</Label><Input id="feeRangeUSDEdit" value={currentTaskConfig.feeRangeUSD || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, feeRangeUSD: e.target.value}))} /></div>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="pricingModelEdit">Pricing Model</Label><Select value={currentTaskConfig.pricingModel} onValueChange={(value) => setCurrentTaskConfig(p => ({...p, pricingModel: value as "per_page" | "fixed"}))}><SelectTrigger id="pricingModelEdit"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="per_page">Per Page</SelectItem><SelectItem value="fixed">Fixed Price</SelectItem></SelectContent></Select></div>
                    {currentTaskConfig.pricingModel === "per_page" && (<div className="space-y-1.5"><Label htmlFor="pricePerPageNGNEdit">Price Per Page (NGN)</Label><Input id="pricePerPageNGNEdit" type="number" value={currentTaskConfig.pricePerPageNGN || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, pricePerPageNGN: e.target.value ? parseFloat(e.target.value) : null, fixedPriceNGN: null}))} /></div>)}
                    {currentTaskConfig.pricingModel === "fixed" && (<div className="space-y-1.5"><Label htmlFor="fixedPriceNGNEdit">Fixed Price (NGN)</Label><Input id="fixedPriceNGNEdit" type="number" value={currentTaskConfig.fixedPriceNGN || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, fixedPriceNGN: e.target.value ? parseFloat(e.target.value) : null, pricePerPageNGN: null}))} /></div>)}
                    <div className="space-y-1.5"><Label htmlFor="notesEdit">Notes</Label><Textarea id="notesEdit" value={currentTaskConfig.notes || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, notes: e.target.value}))} /></div>
                </div>
                <DialogFooter><DialogClose asChild><Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button></DialogClose><Button onClick={handleSaveTaskConfig}>Save {editingTaskId ? "Changes" : "Task Type"}</Button></DialogFooter>
            </DialogContent>
        </Dialog>

        <Card>
          <CardHeader><CardTitle className="font-headline flex items-center"><Gift className="mr-2 h-5 w-5 text-primary"/>Referral Program Management</CardTitle><CardDescription>Configure referral bonuses.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5"><Label htmlFor="referralProgramActive" className="text-base">Referral Program Active</Label><p className="text-sm text-muted-foreground">Enable or disable the program.</p></div>
              <Switch id="referralProgramActive" defaultChecked aria-label="Toggle referral program" />
            </div>
            <div className="space-y-4 p-4 border rounded-lg"><h4 className="font-medium text-md flex items-center"><Users2 className="mr-2 h-4 w-4 text-muted-foreground"/> Student Referrals</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="studentSignupBonus">Signup Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="studentSignupBonus" type="number" defaultValue="100.00" className="pl-8" /></div></div><div className="space-y-1.5"><Label htmlFor="studentYearlySubBonus">Yearly Sub Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="studentYearlySubBonus" type="number" defaultValue="1000.00" className="pl-8" /></div></div></div></div>
            <div className="space-y-4 p-4 border rounded-lg"><h4 className="font-medium text-md flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground"/> Print Center Referrals</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="pcSignupBonus">Signup Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="pcSignupBonus" type="number" defaultValue="250.00" className="pl-8" /></div></div><div className="space-y-1.5"><Label htmlFor="pcFirstTransactionBonus">First Paid Job Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="pcFirstTransactionBonus" type="number" defaultValue="500.00" className="pl-8" /></div></div></div></div>
            <div className="space-y-4 p-4 border rounded-lg"><h4 className="font-medium text-md flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/> VA Referrals</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="vaSignupBonus">Signup Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="vaSignupBonus" type="number" defaultValue="150.00" className="pl-8" /></div></div><div className="space-y-1.5"><Label htmlFor="vaFirstTaskBonus">First Task Bonus (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="vaFirstTaskBonus" type="number" defaultValue="300.00" className="pl-8" /></div></div></div></div>
            <div className="space-y-1.5"><Label htmlFor="minWithdrawalGlobal">Min. Withdrawal (NGN)</Label><div className="relative"><span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span><Input id="minWithdrawalGlobal" type="number" defaultValue="100.00" className="pl-8" /></div><p className="text-xs text-muted-foreground">Applies to all referral earnings withdrawals.</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-headline flex items-center"><Radio className="mr-2 h-5 w-5 text-primary"/>Ads Management</CardTitle><CardDescription>Configure platform advertising.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5"><Label htmlFor="adsApiUrl">Ads API URL</Label><Input id="adsApiUrl" type="url" placeholder="https://your-ads-provider.com/api" /><p className="text-xs text-muted-foreground">Enter ads provider API endpoint.</p></div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5"><Label htmlFor="enableAdsPlatformWide" className="text-base">Enable Ads Platform-Wide</Label><p className="text-sm text-muted-foreground">Toggle ads for all users.</p></div>
              <Switch id="enableAdsPlatformWide" defaultChecked aria-label="Toggle platform-wide ads" />
            </div>
            <div className="text-sm text-muted-foreground p-3 bg-muted/30 border rounded-md"><p>When enabled, ads display to all users unless they have an "Ads Blocker" subscription.</p><p className="mt-1">"Ads Blocker" subscription (1 month) removes ads.</p></div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="mr-2 h-4 w-4" /> Save All Settings
            </Button>
        </div>
      </form>
    </div>
  );
}


    