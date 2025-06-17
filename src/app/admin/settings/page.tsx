"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, DollarSign, Percent, Gift, Users2, Building, Briefcase, ClipboardList, Radio, Edit3, Trash2, PlusCircle } from "lucide-react";
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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";


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
  taskTypeName: "",
  feeRangeNGN: "",
  feeRangeUSD: "",
  pricingModel: "per_page",
  pricePerPageNGN: null,
  fixedPriceNGN: null,
  notes: "",
};


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [taskConfigs, setTaskConfigs] = useState<TaskPricingConfig[]>(INITIAL_TASK_PRICING_CONFIG);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTaskConfig, setCurrentTaskConfig] = useState<Omit<TaskPricingConfig, 'id' | 'isActive'>>(emptyTaskConfig);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAddNewTaskType = () => {
    setCurrentTaskConfig(emptyTaskConfig);
    setEditingTaskId(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEditTaskType = (task: TaskPricingConfig) => {
    setCurrentTaskConfig({ ...task });
    setEditingTaskId(task.id);
    setIsEditDialogOpen(true);
  };

  const handleSaveTaskConfig = () => {
    if (!currentTaskConfig.taskTypeName.trim()) {
        toast({title: "Task Type Name Required", description: "Please enter a name for the task type.", variant: "destructive"});
        return;
    }

    if (editingTaskId) { // Editing existing
        setTaskConfigs(prev => prev.map(task => task.id === editingTaskId ? { ...currentTaskConfig, id: editingTaskId, isActive: task.isActive } as TaskPricingConfig : task));
        toast({title: "Task Type Updated", description: `${currentTaskConfig.taskTypeName} has been updated.`});
    } else { // Adding new
        const newTask: TaskPricingConfig = {
            ...currentTaskConfig,
            id: `task_${Date.now()}`,
            isActive: true, // New tasks are active by default
        };
        setTaskConfigs(prev => [...prev, newTask]);
        toast({title: "Task Type Added", description: `${currentTaskConfig.taskTypeName} has been added.`});
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setCurrentTaskConfig(emptyTaskConfig);
    setEditingTaskId(null);
  };
  
  const handleToggleTaskStatus = (taskId: string, isActive: boolean) => {
    setTaskConfigs(prev => prev.map(task => 
        task.id === taskId ? { ...task, isActive } : task
    ));
    const taskName = taskConfigs.find(t => t.id === taskId)?.taskTypeName;
    toast({
        title: `Task Type ${isActive ? 'Activated' : 'Deactivated'}`,
        description: `${taskName || 'Task'} is now ${isActive ? 'active' : 'inactive'}.`,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit all settings to a backend
    toast({
      title: "Settings Saved (Simulated)",
      description: "All platform settings have been saved.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Platform Settings"
        description="Configure general settings, payment parameters, task pricing, referral program rules, and ad management."
        icon={Settings}
      />
      
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">General Settings</CardTitle>
            <CardDescription>Basic configuration for the STIPS Lite platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="STIPS Lite" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access to the platform for users.
                </p>
              </div>
              <Switch id="maintenanceMode" aria-label="Toggle maintenance mode" />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@stipslite.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Payment &amp; Subscription Settings</CardTitle>
            <CardDescription>Manage currency, task pricing, and subscription tiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Input id="currency" defaultValue="NGN" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="serviceFee">Service Fee Percentage</Label>
                    <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="serviceFee" type="number" defaultValue="5" className="pl-8" />
                    </div>
                </div>
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="subscriptionTiers">Subscription Tier Configuration (JSON)</Label>
              <Textarea id="subscriptionTiers" rows={5} defaultValue={JSON.stringify([
                  { id: "basic", name: "Basic", priceMonthly: 9.99, priceYearly: 99.99, currency: "NGN" },
                  { id: "pro", name: "Pro", priceMonthly: 19.99, priceYearly: 199.99, currency: "NGN" },
                  { id: "expert_va_student", name: "Student Expert VA Plan", priceMonthly: 500, priceYearly: 2000, currency: "NGN"},
                  { id: "va_professional_business", name: "VA Professional Business Plan", priceMonthly: 1000, priceYearly: 5000, currency: "NGN"}
              ], null, 2)} 
              className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">Define subscription plans and their pricing. Requires restart or dynamic loading to apply changes.</p>
            </div>
          </CardContent>
        </Card>

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
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task Type Name</TableHead>
                            <TableHead>Fee Range (NGN/USD)</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {taskConfigs.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.taskTypeName}</TableCell>
                                <TableCell>{task.feeRangeNGN}{task.feeRangeUSD ? ` / ${task.feeRangeUSD}` : ''}</TableCell>
                                <TableCell>
                                    {task.pricingModel === 'per_page' ? `Per Page: ₦${task.pricePerPageNGN || 0}` : `Fixed: ₦${task.fixedPriceNGN || 0}`}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Switch 
                                          id={`task-status-${task.id}`} 
                                          checked={task.isActive} 
                                          onCheckedChange={(checked) => handleToggleTaskStatus(task.id, checked)}
                                      />
                                      <Label htmlFor={`task-status-${task.id}`} className="text-xs">{task.isActive ? 'Active' : 'Inactive'}</Label>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs max-w-xs truncate">{task.notes || '-'}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleEditTaskType(task)}>
                                        <Edit3 className="mr-1 h-3.5 w-3.5"/> Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            )}
          </CardContent>
        </Card>
        
        {/* Dialog for Adding/Editing Task Type */}
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={editingTaskId ? setIsEditDialogOpen : setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingTaskId ? "Edit" : "Add New"} Task Type</DialogTitle>
                    <DialogDescription>
                        {editingTaskId ? "Modify the details for this task type." : "Define a new task type and its pricing structure."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="taskTypeNameEdit">Task Type Name</Label>
                        <Input id="taskTypeNameEdit" value={currentTaskConfig.taskTypeName} onChange={(e) => setCurrentTaskConfig(p => ({...p, taskTypeName: e.target.value}))} required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="feeRangeNGNEdit">Fee Range (NGN)</Label>
                            <Input id="feeRangeNGNEdit" value={currentTaskConfig.feeRangeNGN} onChange={(e) => setCurrentTaskConfig(p => ({...p, feeRangeNGN: e.target.value}))} placeholder="e.g., 1000-2000" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="feeRangeUSDEdit">Fee Range (USD)</Label>
                            <Input id="feeRangeUSDEdit" value={currentTaskConfig.feeRangeUSD || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, feeRangeUSD: e.target.value}))} placeholder="e.g., 5-10 (Optional)" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="pricingModelEdit">Pricing Model</Label>
                        <Select value={currentTaskConfig.pricingModel} onValueChange={(value) => setCurrentTaskConfig(p => ({...p, pricingModel: value as "per_page" | "fixed"}))}>
                            <SelectTrigger id="pricingModelEdit"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="per_page">Per Page</SelectItem>
                                <SelectItem value="fixed">Fixed Price</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {currentTaskConfig.pricingModel === "per_page" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="pricePerPageNGNEdit">Price Per Page (NGN)</Label>
                            <Input id="pricePerPageNGNEdit" type="number" value={currentTaskConfig.pricePerPageNGN || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, pricePerPageNGN: e.target.value ? parseFloat(e.target.value) : null, fixedPriceNGN: null}))} />
                        </div>
                    )}
                    {currentTaskConfig.pricingModel === "fixed" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="fixedPriceNGNEdit">Fixed Price (NGN)</Label>
                            <Input id="fixedPriceNGNEdit" type="number" value={currentTaskConfig.fixedPriceNGN || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, fixedPriceNGN: e.target.value ? parseFloat(e.target.value) : null, pricePerPageNGN: null}))} />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="notesEdit">Notes</Label>
                        <Textarea id="notesEdit" value={currentTaskConfig.notes || ""} onChange={(e) => setCurrentTaskConfig(p => ({...p, notes: e.target.value}))} placeholder="Optional notes for this task type"/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }}>Cancel</Button></DialogClose>
                    <Button onClick={handleSaveTaskConfig}>Save {editingTaskId ? "Changes" : "Task Type"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Gift className="mr-2 h-5 w-5 text-primary"/>Referral Program Management</CardTitle>
            <CardDescription>Configure referral bonuses for different user types and actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="referralProgramActive" className="text-base">Referral Program Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the entire referral program.
                </p>
              </div>
              <Switch id="referralProgramActive" defaultChecked aria-label="Toggle referral program" />
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium text-md flex items-center"><Users2 className="mr-2 h-4 w-4 text-muted-foreground"/> Student Referral Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="studentSignupBonus">New Student Signup Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="studentSignupBonus" type="number" defaultValue="100.00" className="pl-8" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="studentYearlySubBonus">Student Yearly Subscription Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="studentYearlySubBonus" type="number" defaultValue="1000.00" className="pl-8" />
                        </div>
                    </div>
                </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium text-md flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground"/> Print Center Referral Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="pcSignupBonus">New Print Center Signup Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="pcSignupBonus" type="number" defaultValue="250.00" className="pl-8" />
                        </div>
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="pcFirstTransactionBonus">Print Center First Paid Job Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="pcFirstTransactionBonus" type="number" defaultValue="500.00" className="pl-8" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium text-md flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/> Virtual Assistant (VA) Referral Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="vaSignupBonus">New VA Signup Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="vaSignupBonus" type="number" defaultValue="150.00" className="pl-8" />
                        </div>
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="vaFirstTaskBonus">VA First Completed Task Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="vaFirstTaskBonus" type="number" defaultValue="300.00" className="pl-8" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-1.5">
                <Label htmlFor="minWithdrawalGlobal">Minimum Withdrawal Amount (NGN - Global)</Label>
                 <div className="relative">
                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                    <Input id="minWithdrawalGlobal" type="number" defaultValue="100.00" className="pl-8" />
                </div>
                 <p className="text-xs text-muted-foreground">This applies to all referral earnings withdrawals.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Radio className="mr-2 h-5 w-5 text-primary"/>Ads Management</CardTitle>
            <CardDescription>Configure platform-wide advertising settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="adsApiUrl">Ads API URL (e.g., Google AdSense)</Label>
              <Input id="adsApiUrl" type="url" placeholder="https://your-ads-provider.com/api/endpoint" />
               <p className="text-xs text-muted-foreground">Enter the API endpoint for your ads provider.</p>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="enableAdsPlatformWide" className="text-base">Enable Ads Platform-Wide</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle to show or hide ads for all users across the platform.
                </p>
              </div>
              <Switch id="enableAdsPlatformWide" defaultChecked aria-label="Toggle platform-wide ads" />
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted/30 border rounded-md">
              <p>
                When enabled, ads will be displayed to Student, VA, and Print Center accounts.
                Ads can be hidden for specific users if they have an active "Ads Blocker" subscription 
                (this would be a separate subscription feature, managed per user or via subscription tiers).
              </p>
              <p className="mt-1">
                The "Ads Blocker" subscription would typically last for one month and remove ads for that duration.
              </p>
            </div>
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
