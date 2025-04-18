
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ClipboardList,
  Clock,
  Download,
  FileText,
  MapPin,
  Paperclip,
  PenLine,
  Phone,
  UploadCloud,
  User,
  Users,
  Video,
} from "lucide-react";

// Mock data for the component
const caseMockData = {
  "CIV-2023-45": {
    id: "CIV-2023-45",
    title: "Smith vs. Albany Corp",
    type: "Civil",
    status: "pending",
    priority: "high",
    filingDate: "2023-04-12",
    description: "Plaintiff alleges breach of contract and seeks damages of $150,000 for financial losses incurred due to the defendant's failure to deliver services as specified in the agreement dated January 15, 2023.",
    plaintiff: "James Smith",
    defendant: "Albany Corporation",
    judge: "Hon. Rebecca Martinez",
    attorneys: [
      { name: "Sarah Johnson", party: "Plaintiff", firm: "Johnson & Associates" },
      { name: "Michael Williams", party: "Defendant", firm: "Williams Legal Group" }
    ],
    hearings: [
      { id: "H-1234", type: "Pre-trial Conference", date: "2023-05-15", time: "09:30 AM", location: "Courtroom 3B", virtual: true },
      { id: "H-1235", type: "Evidence Hearing", date: "2023-06-10", time: "10:00 AM", location: "Courtroom 3B", virtual: false }
    ],
    documents: [
      { id: "DOC-1", name: "Initial Complaint", date: "2023-04-12", type: "PDF", size: "1.2 MB" },
      { id: "DOC-2", name: "Response to Complaint", date: "2023-04-28", type: "PDF", size: "0.9 MB" },
      { id: "DOC-3", name: "Evidence Exhibit A", date: "2023-05-02", type: "PDF", size: "3.5 MB" }
    ],
    updates: [
      { date: "2023-04-28", user: "System", update: "Response to complaint filed by defendant" },
      { date: "2023-04-20", user: "Hon. Rebecca Martinez", update: "Pre-trial conference scheduled for May 15, 2023" },
      { date: "2023-04-12", user: "Sarah Johnson", update: "Initial complaint filed" }
    ]
  },
  "CRM-2023-28": {
    id: "CRM-2023-28",
    title: "State vs. Johnson",
    type: "Criminal",
    status: "in-progress",
    priority: "medium",
    filingDate: "2023-04-10",
    description: "Defendant charged with felony theft under state statute 18.4.401. Prosecution alleges the defendant unlawfully took property valued at approximately $5,000 from a local retail establishment on March 15, 2023.",
    plaintiff: "State",
    defendant: "Robert Johnson",
    judge: "Hon. Daniel Chen",
    attorneys: [
      { name: "Lisa Montgomery", party: "Prosecution", firm: "District Attorney's Office" },
      { name: "Thomas Baker", party: "Defense", firm: "Public Defender's Office" }
    ],
    hearings: [
      { id: "H-1236", type: "Arraignment", date: "2023-04-20", time: "11:00 AM", location: "Courtroom 5A", virtual: false, completed: true },
      { id: "H-1237", type: "Bail Hearing", date: "2023-04-25", time: "09:00 AM", location: "Courtroom 5A", virtual: false, completed: true },
      { id: "H-1238", type: "Preliminary Hearing", date: "2023-05-12", time: "10:30 AM", location: "Courtroom 5A", virtual: true }
    ],
    documents: [
      { id: "DOC-4", name: "Criminal Complaint", date: "2023-04-10", type: "PDF", size: "0.8 MB" },
      { id: "DOC-5", name: "Police Report", date: "2023-04-10", type: "PDF", size: "1.7 MB" },
      { id: "DOC-6", name: "Bail Motion", date: "2023-04-22", type: "PDF", size: "0.5 MB" }
    ],
    updates: [
      { date: "2023-04-25", user: "Hon. Daniel Chen", update: "Bail set at $10,000" },
      { date: "2023-04-20", user: "System", update: "Defendant arraigned, pleaded not guilty" },
      { date: "2023-04-10", user: "Lisa Montgomery", update: "Criminal charges filed" }
    ]
  }
};

export function CaseDetail({ caseId }: { caseId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get case data from mock
  const caseData = caseMockData[caseId as keyof typeof caseMockData];
  
  if (!caseData) {
    return <div>Case not found</div>;
  }
  
  return (
    <div>
      <div className="flex flex-col space-y-1 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{caseData.title}</h2>
          <div className="flex items-center space-x-2">
            <CaseStatusBadge status={caseData.status} />
            <CasePriorityBadge priority={caseData.priority} />
          </div>
        </div>
        <div className="text-muted-foreground">
          {caseData.id} • {caseData.type} • Filed on {new Date(caseData.filingDate).toLocaleDateString()}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hearings">Hearings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="history" className="hidden md:block">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <section className="space-y-3">
            <h3 className="text-lg font-medium">Case Description</h3>
            <p>{caseData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Plaintiff</h4>
                <p className="text-base">{caseData.plaintiff}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Defendant</h4>
                <p className="text-base">{caseData.defendant}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Assigned Judge</h4>
                <p className="text-base">{caseData.judge}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Filing Date</h4>
                <p className="text-base">{new Date(caseData.filingDate).toLocaleDateString()}</p>
              </div>
            </div>
          </section>
          
          <Separator />
          
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Upcoming Hearings</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-2">
              {caseData.hearings
                // Show only the first two hearings
                .slice(0, 2)
                .map(hearing => (
                  <div key={hearing.id} className="flex items-center justify-between border rounded-md p-3">
                    <div className="space-y-1">
                      <div className="font-medium">{hearing.type}</div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 items-center">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(hearing.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {hearing.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {hearing.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={hearing.virtual ? "default" : "outline"}>
                        {hearing.virtual ? "Virtual" : "In-Person"}
                      </Badge>
                      {hearing.virtual && (
                        <Button size="sm" className="ml-2">
                          <Video className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
          
          <Separator />
          
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Documents</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-2">
              {caseData.documents.slice(0, 3).map(doc => (
                <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString()} • {doc.type} • {doc.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
          
          <Separator />
          
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Updates</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {caseData.updates.slice(0, 3).map((update, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {new Date(update.date).toLocaleDateString()} by {update.user}
                  </div>
                  <div>{update.update}</div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="hearings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Scheduled Hearings</h3>
              <Button>
                <Calendar className="mr-1 h-4 w-4" />
                Schedule Hearing
              </Button>
            </div>
            
            <div className="space-y-4">
              {caseData.hearings.map(hearing => (
                <div key={hearing.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg">{hearing.type}</h4>
                    <Badge variant={hearing.virtual ? "default" : "outline"}>
                      {hearing.virtual ? "Virtual" : "In-Person"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(hearing.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{hearing.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{hearing.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>All parties required</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hearing.virtual && (
                      <Button>
                        <Video className="mr-1 h-4 w-4" />
                        Join Virtual Hearing
                      </Button>
                    )}
                    <Button variant="outline">
                      <PenLine className="mr-1 h-4 w-4" />
                      Add Notes
                    </Button>
                    <Button variant="outline">
                      <ClipboardList className="mr-1 h-4 w-4" />
                      View Agenda
                    </Button>
                    {hearing.completed && (
                      <Button variant="outline">
                        <FileText className="mr-1 h-4 w-4" />
                        View Transcript
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Case Documents</h3>
              <div className="flex space-x-2">
                <Button>
                  <UploadCloud className="mr-1 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {caseData.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between border rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString()} • {doc.type} • {doc.size}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="parties">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-lg font-medium">Primary Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Plaintiff</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{caseData.plaintiff}</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Defendant</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{caseData.defendant}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section className="space-y-3">
              <h3 className="text-lg font-medium">Legal Representation</h3>
              <div className="space-y-4">
                {caseData.attorneys.map((attorney, idx) => (
                  <div key={idx} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{attorney.name}</h4>
                      <Badge variant="outline">{attorney.party} Counsel</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {attorney.firm}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="mr-1 h-3 w-3" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-1 h-3 w-3" />
                        View Filings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-2">
                <Users className="mr-1 h-4 w-4" />
                Add Additional Party
              </Button>
            </section>
            
            <Separator />
            
            <section className="space-y-3">
              <h3 className="text-lg font-medium">Court Assignment</h3>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Presiding Judge</h4>
                <div className="text-base mb-3">{caseData.judge}</div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-1 h-3 w-3" />
                  View Judge's Calendar
                </Button>
              </div>
            </section>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Case History</h3>
            
            <div className="space-y-4">
              {caseData.updates.map((update, idx) => (
                <div key={idx} className="border-l-2 border-muted pl-4 pb-4">
                  <div className="text-sm font-medium">
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                  <div className="text-muted-foreground text-sm mb-1">
                    {update.user}
                  </div>
                  <div>
                    {update.update}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
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
