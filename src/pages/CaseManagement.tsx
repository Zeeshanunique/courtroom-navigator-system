
import { useState } from "react";
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
  Video
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

// Demo data
const casesData = [
  { id: "CIV-2023-45", title: "Smith vs. Albany Corp", type: "Civil", status: "pending", date: "2023-04-12", priority: "high" },
  { id: "CRM-2023-28", title: "State vs. Johnson", type: "Criminal", status: "in-progress", date: "2023-04-10", priority: "medium" },
  { id: "FAM-2023-15", title: "Thompson Custody Case", type: "Family", status: "adjourned", date: "2023-04-08", priority: "medium" },
  { id: "CIV-2023-42", title: "Roberts vs. City Council", type: "Civil", status: "pending", date: "2023-04-06", priority: "low" },
  { id: "CRM-2023-27", title: "State vs. Williams", type: "Criminal", status: "closed", date: "2023-04-05", priority: "high" },
  { id: "CIV-2023-41", title: "Garcia vs. Merton Inc", type: "Civil", status: "pending", date: "2023-04-03", priority: "medium" },
  { id: "FAM-2023-14", title: "Peterson Divorce Settlement", type: "Family", status: "adjourned", date: "2023-04-02", priority: "low" },
  { id: "CRM-2023-26", title: "State vs. Davis", type: "Criminal", status: "in-progress", date: "2023-04-01", priority: "high" },
];

export default function CaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [caseDetailOpen, setCaseDetailOpen] = useState(false);
  
  const filteredCases = casesData.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchQuery.toLowerCase())
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
            <NewCaseDialog />
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
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Case Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-medium text-left"
                        onClick={() => handleViewCase(caseItem.id)}
                      >
                        {caseItem.title}
                      </Button>
                    </TableCell>
                    <TableCell>{caseItem.type}</TableCell>
                    <TableCell>
                      <CaseStatusBadge status={caseItem.status} />
                    </TableCell>
                    <TableCell>
                      <CasePriorityBadge priority={caseItem.priority} />
                    </TableCell>
                    <TableCell>{new Date(caseItem.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewCase(caseItem.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <CaseActionsDropdown caseId={caseItem.id} caseStatus={caseItem.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No cases found matching "{searchQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Case Detail Dialog */}
      <Dialog open={caseDetailOpen} onOpenChange={setCaseDetailOpen}>
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          {selectedCase && <CaseDetail caseId={selectedCase} />}
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}

function CaseStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Pending</Badge>;
    case "in-progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">In Progress</Badge>;
    case "adjourned":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Adjourned</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Closed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function CasePriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return <Badge variant="default" className="bg-destructive">High</Badge>;
    case "medium":
      return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
    case "low":
      return <Badge variant="default" className="bg-green-600">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
}

function CaseActionsDropdown({ caseId, caseStatus }: { caseId: string, caseStatus: string }) {
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
        {caseStatus !== "closed" ? (
          <DropdownMenuItem className="text-destructive">Close Case</DropdownMenuItem>
        ) : (
          <DropdownMenuItem>Reopen Case</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NewCaseDialog() {
  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="case-type" className="text-right">
              Type
            </Label>
            <Select>
              <SelectTrigger id="case-type" className="col-span-3">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" placeholder="Case title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plaintiff" className="text-right">
              Plaintiff
            </Label>
            <Input id="plaintiff" placeholder="Plaintiff name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="defendant" className="text-right">
              Defendant
            </Label>
            <Input id="defendant" placeholder="Defendant name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select>
              <SelectTrigger id="priority" className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea id="description" placeholder="Brief case description" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Register Case</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
