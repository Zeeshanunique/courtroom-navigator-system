import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2
} from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { caseMockData } from "./mockData";

// Define type for case details
interface CaseDetails {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  plaintiff: string;
  defendant: string;
  judge_id: string;
  created_at: string;
  case_number: string;
  [key: string]: any; // For any additional fields
}

// Define type for a hearing
interface Hearing {
  id: string;
  caseId: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string; 
  virtual: boolean;
  judge?: string;
  duration?: number;
  [key: string]: any;
}

// Define type for a document
interface Document {
  id: string;
  name: string;
  date: string;
  type: string;
  size: string;
  caseId: string;
  category?: string;
  uploadedBy?: string;
  [key: string]: any;
}

export function CaseDetail({ caseId }: { caseId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<CaseDetails | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  useEffect(() => {
    const fetchCaseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get case data
        const caseRef = doc(db, "cases", caseId);
        const caseSnap = await getDoc(caseRef);
        
        if (caseSnap.exists()) {
          setCaseData(caseSnap.data() as CaseDetails);
          
          // Get hearings for this case
          const hearingsQuery = query(
            collection(db, "hearings"),
            where("caseId", "==", caseId),
            orderBy("date"),
            orderBy("time")
          );
          
          const hearingsSnap = await getDocs(hearingsQuery);
          const hearingsData = hearingsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Hearing[];
          
          setHearings(hearingsData);
          
          // Get documents for this case
          const documentsQuery = query(
            collection(db, "documents"),
            where("caseId", "==", caseId),
            orderBy("created_at", "desc")
          );
          
          const documentsSnap = await getDocs(documentsQuery);
          const documentsData = documentsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure date is available for UI display
            date: doc.data().uploadDate || doc.data().created_at
          })) as Document[];
          
          setDocuments(documentsData);
          
        } else {
          // Fall back to mock data if no real data exists
          console.warn("No Firebase data found for case ID: " + caseId + ", falling back to mock data");
          const mockCase = caseMockData[caseId as keyof typeof caseMockData];
          
          if (mockCase) {
            setCaseData({
              id: mockCase.id,
              title: mockCase.title,
              type: mockCase.type,
              status: mockCase.status,
              priority: mockCase.priority,
              description: mockCase.description,
              plaintiff: mockCase.plaintiff,
              defendant: mockCase.defendant,
              judge_id: mockCase.judge,
              created_at: mockCase.filingDate,
              case_number: mockCase.id
            });
            setHearings(mockCase.hearings.map(h => ({
              ...h,
              caseId: mockCase.id
            })));
            setDocuments(mockCase.documents.map(d => ({
              ...d,
              caseId: mockCase.id
            })));
          } else {
            setError("Case not found");
          }
        }
      } catch (err) {
        console.error("Error fetching case data:", err);
        setError("Failed to load case data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseData();
  }, [caseId]);
  
  if (loading) {
    return <CaseDetailSkeleton />;
  }
  
  if (error || !caseData) {
    return <div className="p-4 text-red-500">{error || "Failed to load case details"}</div>;
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
          {caseData.case_number} • {caseData.type} • Filed on {new Date(caseData.created_at).toLocaleDateString()}
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
                <p className="text-base">{caseData.judge_id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Filing Date</h4>
                <p className="text-base">{new Date(caseData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </section>
          
          <Separator />
          
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Upcoming Hearings</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("hearings")}>View All</Button>
            </div>
            <div className="space-y-2">
              {hearings.length > 0 ? (
                hearings
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
                  ))
              ) : (
                <div className="text-center py-3 text-muted-foreground border rounded-md">
                  No hearings scheduled
                </div>
              )}
            </div>
          </section>
          
          <Separator />
          
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Documents</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("documents")}>View All</Button>
            </div>
            <div className="space-y-2">
              {documents.length > 0 ? (
                documents.slice(0, 3).map(doc => (
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
                ))
              ) : (
                <div className="text-center py-3 text-muted-foreground border rounded-md">
                  No documents available
                </div>
              )}
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
              {hearings.map(hearing => (
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
                    {hearing.duration && (
                      <Button variant="outline">
                        <Loader2 className="mr-1 h-4 w-4" />
                        {hearing.duration} minutes
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
              {documents.map(doc => (
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
                {/* Legal representation section would be populated here */}
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
                <div className="text-base mb-3">{caseData.judge_id}</div>
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
              {/* Case history section would be populated here */}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CaseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      
      <Skeleton className="h-0.5 w-full" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

function CaseStatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Pending</Badge>;
    case "in progress":
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
  switch (priority.toLowerCase()) {
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
