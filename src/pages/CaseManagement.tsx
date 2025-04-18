import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  ChevronDown, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search,
  Video,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CaseDetail } from "@/components/cases/CaseDetail";
import { db } from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Case, 
  CasePriority, 
  CaseStatus, 
  CaseType,
  CONSTANTS 
} from "@/integrations/firebase/types";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useFetchCollection } from "@/hooks/useFirebaseQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [caseDetailOpen, setCaseDetailOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Fetch cases from Firebase
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'cases'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const casesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Case));
        
        setCases(casesData);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError("Failed to load cases");
        toast({
          title: "Error",
          description: "Failed to load cases. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCases();
  }, [toast]);
  
  // Add a new case to the list after creating it
  const handleCaseAdded = (newCase: Case) => {
    setCases(prevCases => [newCase, ...prevCases]);
  };
  
  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (caseItem.case_number && caseItem.case_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleViewCase = (caseId: string) => {
    setSelectedCase(caseId);
    setCaseDetailOpen(true);
  };
  
  return (
    <Dashboard>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Case Management</h1>
            <p className="text-muted-foreground">
              View, track, and manage all court cases in the system
            </p>
          </div>
          
          <div className="flex space-x-2">
            <NewCaseDialog onCaseAdded={handleCaseAdded} />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-4 w-4" />
              Filter
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">Active Cases</Button>
            <Button variant="outline" size="sm">Recently Updated</Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading cases...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredCases.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Case #</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Filed Date</TableHead>
                          <TableHead>Next Court Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCases.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.case_number || c.id.substring(0, 8)}</TableCell>
                            <TableCell>
                              <a href={`/case/${c.id}`} className="hover:underline">
                                {c.title}
                              </a>
                            </TableCell>
                            <TableCell>{c.type}</TableCell>
                            <TableCell>{c.client}</TableCell>
                            <TableCell>
                              <CaseStatusBadge status={c.status} />
                            </TableCell>
                            <TableCell>
                              {c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              {c.courtDate ? new Date(c.courtDate).toLocaleDateString() : "Not set"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => window.location.href = `/case/${c.id}`}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit Case</DropdownMenuItem>
                                  <DropdownMenuItem>Add Document</DropdownMenuItem>
                                  <DropdownMenuItem>Schedule Hearing</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Archive Case
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full border-2 border-dashed p-6">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No cases found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchQuery 
                      ? "No cases match your search criteria. Try a different search term or clear the search."
                      : "You don't have any cases in this category yet. Add a new case to get started."}
                  </p>
                  <AddCaseDialog>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Case
                    </Button>
                  </AddCaseDialog>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Case Detail Dialog */}
      <Dialog open={caseDetailOpen} onOpenChange={setCaseDetailOpen}>
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogTitle className="text-xl">Case Details</DialogTitle>
              <CaseDetail caseId={selectedCase} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}

function CaseStatusBadge({ status }: { status: CaseStatus }) {
  switch (status) {
    case "Pending":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Pending</Badge>;
    case "In Progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">In Progress</Badge>;
    case "Adjourned":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Adjourned</Badge>;
    case "Closed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Closed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function CasePriorityBadge({ priority }: { priority: CasePriority }) {
  switch (priority) {
    case "High":
      return <Badge variant="default" className="bg-destructive">High</Badge>;
    case "Medium":
      return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
    case "Low":
      return <Badge variant="default" className="bg-green-600">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
}

function CaseActionsDropdown({ caseId, caseStatus }: { caseId: string, caseStatus: CaseStatus }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit Case</DropdownMenuItem>
        <DropdownMenuItem>Schedule Hearing</DropdownMenuItem>
        <DropdownMenuItem>
          <Video className="mr-2 h-4 w-4" />
          Virtual Hearing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {caseStatus !== "Closed" ? (
          <DropdownMenuItem className="text-destructive">Close Case</DropdownMenuItem>
        ) : (
          <DropdownMenuItem>Reopen Case</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Interface for the NewCaseDialog component
interface NewCaseDialogProps {
  onCaseAdded: (newCase: Case) => void;
}

// New case form data type
interface NewCaseFormData {
  type: CaseType | '';
  title: string;
  plaintiff: string;
  defendant: string;
  priority: CasePriority | '';
  description: string;
}

function NewCaseDialog({ onCaseAdded }: NewCaseDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewCaseFormData>({
    type: '',
    title: '',
    plaintiff: '',
    defendant: '',
    priority: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.type || !formData.title || !formData.priority) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the case data
      const caseData = {
        type: formData.type as CaseType,
        title: formData.title,
        plaintiff: formData.plaintiff || null,
        defendant: formData.defendant || null,
        priority: formData.priority as CasePriority,
        description: formData.description || null,
        status: "Pending" as CaseStatus,
        filed_by: user?.uid || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        case_number: `CASE-${Date.now().toString(36).toUpperCase()}`,
        judge_id: null
      };
      
      // Add new case to Firestore
      const docRef = await addDoc(collection(db, 'cases'), caseData);
      
      // Create the new case with ID
      const newCase: Case = {
        id: docRef.id,
        ...caseData
      };
      
      // Add the new case to the UI
      onCaseAdded(newCase);
      
      // Show success message
      toast({
        title: "Case Registered",
        description: "The new case has been successfully registered.",
      });
      
      // Reset form and close dialog
      setFormData({
        type: '',
        title: '',
        plaintiff: '',
        defendant: '',
        priority: '',
        description: ''
      });
      setIsOpen(false);
      
    } catch (error: any) {
      console.error("Error registering case:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error registering the case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Register New Case
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register New Case</DialogTitle>
          <DialogDescription>
            Enter the details for the new case record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Criminal">Criminal</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="title" 
                placeholder="Case title" 
                className="col-span-3" 
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plaintiff" className="text-right">
                Plaintiff
              </Label>
              <Input 
                id="plaintiff" 
                placeholder="Plaintiff name" 
                className="col-span-3" 
                value={formData.plaintiff}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defendant" className="text-right">
                Defendant
              </Label>
              <Input 
                id="defendant" 
                placeholder="Defendant name" 
                className="col-span-3" 
                value={formData.defendant}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger id="priority" className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea 
                id="description" 
                placeholder="Brief case description" 
                className="col-span-3" 
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Case"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
