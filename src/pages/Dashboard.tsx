import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard as DashboardLayout } from "@/components/layout/Dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, ExternalLink, FileCheck, FilePlus, Loader2, User, Users, Video } from "lucide-react";
import { CaseStatusChart } from "@/components/dashboard/CaseStatusChart";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingHearings } from "@/components/dashboard/UpcomingHearings";
import { useNavigate, Link } from "react-router-dom";
import { useFetchCollection, useCollectionCount } from "@/hooks/useFirebaseQuery";
import { useState, useEffect } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { uploadSampleData } from "@/utils/uploadMockData";
import { useToast } from "@/hooks/use-toast";

// Data initialization component
const DataInitializer = ({ onInitialized }: { onInitialized: () => void }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const { data: casesCount } = useCollectionCount("cases");
  
  useEffect(() => {
    const initializeData = async () => {
      // Only initialize data if we have no data
      if (casesCount === 0 && !isInitializing) {
        setIsInitializing(true);
        try {
          const result = await uploadSampleData();
          if (result.success) {
            toast({
              title: "Data Initialized",
              description: "Sample data has been loaded successfully.",
              variant: "default",
            });
            onInitialized();
          } else {
            toast({
              title: "Data Initialization Failed",
              description: result.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to initialize sample data.",
            variant: "destructive",
          });
        } finally {
          setIsInitializing(false);
        }
      } else if (casesCount > 0) {
        // If we already have data, just call onInitialized
        onInitialized();
      }
    };
    
    initializeData();
  }, [casesCount, onInitialized, isInitializing, toast]);
  
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Initializing data...</p>
      </div>
    );
  }
  
  // Render nothing if not initializing (the parent will handle rendering)
  return null;
};

export default function DashboardPage() {
  const role = useUserRole();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dataInitialized, setDataInitialized] = useState(false);
  
  // States for statistics
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [casesTotal, setCasesTotal] = useState<number | null>(null);
  const [upcomingHearings, setUpcomingHearings] = useState<number | null>(null);
  const [documentCompletion, setDocumentCompletion] = useState<string | null>(null);
  const [assignedCases, setAssignedCases] = useState<number | null>(null);
  
  // Get user's actual name if available, otherwise fall back to role-based demo name
  const userName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}` 
    : getDemoNameByRole(role);
  
  // Get counts from Firebase
  const { data: totalCaseCount, isLoading: isCasesLoading, refetch: refetchCaseCount } = useCollectionCount("cases");
  
  // Load statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoadingStats(true);
      try {
        // Get upcoming hearings (next 7 days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const hearingsQuery = query(
          collection(db, "hearings"), 
          where("date", ">=", today.toISOString().split('T')[0]),
          where("date", "<=", nextWeek.toISOString().split('T')[0])
        );
        
        const hearingsSnapshot = await getDocs(hearingsQuery);
        setUpcomingHearings(hearingsSnapshot.size);
        
        // Get document completion rate (documents vs. cases)
        const docsQuery = query(collection(db, "documents"));
        const docsSnapshot = await getDocs(docsQuery);
        
        // If we have cases and at least some documents
        if (totalCaseCount && docsSnapshot.size > 0) {
          // Calculate an approximate completion percentage
          // (This is simplified - in a real app you'd have a more sophisticated calculation)
          const expectedDocsPerCase = 3; // Assuming each case should have ~3 documents
          const expectedTotal = totalCaseCount * expectedDocsPerCase;
          const completionRate = Math.min(Math.round((docsSnapshot.size / expectedTotal) * 100), 100);
          setDocumentCompletion(completionRate + '%');
        } else {
          setDocumentCompletion('0%');
        }
        
        // Get assigned cases for the current user
        if (user) {
          const assignedQuery = query(
            collection(db, "cases"),
            where("assignedTo", "==", user.uid)
          );
          const assignedSnapshot = await getDocs(assignedQuery);
          setAssignedCases(assignedSnapshot.size);
        }
        
        // Set total cases 
        setCasesTotal(totalCaseCount || 0);
        
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    if (dataInitialized && !isCasesLoading && totalCaseCount !== null) {
      fetchStatistics();
    }
  }, [totalCaseCount, isCasesLoading, user, dataInitialized]);
  
  // Handler for when data is initialized
  const handleDataInitialized = () => {
    setDataInitialized(true);
    refetchCaseCount();
  };
  
  if (!dataInitialized) {
    return <DataInitializer onInitialized={handleDataInitialized} />;
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Courtroom Navigator</h1>
          <p className="text-muted-foreground">Hello, {userName}! Here's an overview of your legal workflow.</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="hearings">Hearings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Total Cases" 
                value={isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : (casesTotal?.toString() || "0")}
                description="Active cases in the system"
                icon={FileCheck} 
              />
              <StatsCard 
                title="Upcoming Hearings" 
                value={isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : (upcomingHearings?.toString() || "0")}
                description="Scheduled for next 7 days"
                icon={Video} 
              />
              <StatsCard 
                title="Documentation" 
                value={isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : (documentCompletion || "0%")}
                description="Completion rate"
                icon={FilePlus} 
              />
              <StatsCard 
                title={role === "judge" ? "Cases Presided" : "Cases Assigned"} 
                value={isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : (assignedCases?.toString() || "0")}
                description="Currently active"
                icon={User} 
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Case Status Distribution</CardTitle>
                  <CardDescription>Overview of case statuses by type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <CaseStatusChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-normal">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <QuickAccessButton 
                    icon={FilePlus} 
                    text="Register New Case"
                    onClick={() => navigate("/cases")}
                  />
                  <QuickAccessButton 
                    icon={Calendar} 
                    text="Schedule Hearing"
                    onClick={() => navigate("/calendar")}
                  />
                  <QuickAccessButton 
                    icon={Clock} 
                    text="View Calendar"
                    onClick={() => navigate("/calendar")}
                  />
                  <QuickAccessButton 
                    icon={Users} 
                    text="Manage Documents"
                    onClick={() => navigate("/documents")}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>Latest cases in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentCases />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Hearings</CardTitle>
                  <CardDescription>Scheduled for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingHearings />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cases">
            <Card>
              <CardHeader>
                <CardTitle>My Cases</CardTitle>
                <CardDescription>Cases assigned to or filed by you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Showing your most recent cases</p>
                  <Button onClick={() => navigate("/cases")}>
                    View All Cases
                  </Button>
                </div>
                <RecentCases />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hearings">
            <Card>
              <CardHeader>
                <CardTitle>My Hearings</CardTitle>
                <CardDescription>Upcoming and past hearings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Your scheduled hearings for the next 30 days</p>
                  <Button onClick={() => navigate("/calendar")}>
                    View Full Calendar
                  </Button>
                </div>
                <UpcomingHearings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center py-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Courtroom Navigator Home Page
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string | React.ReactNode;
  description: string;
  icon: React.FC<{ className?: string }>;
  trend?: string;
}

function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center h-8">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && <p className="text-xs text-primary mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

interface QuickAccessButtonProps {
  icon: React.FC<{ className?: string }>;
  text: string;
  onClick?: () => void;
}

function QuickAccessButton({ icon: Icon, text, onClick }: QuickAccessButtonProps) {
  return (
    <Button variant="outline" className="w-full justify-start" onClick={onClick}>
      <Icon className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}

function getDemoNameByRole(role: string): string {
  switch(role) {
    case "judge":
      return "Judge Adams";
    case "lawyer":
      return "Attorney Smith";
    case "clerk":
      return "Clerk Johnson";
    case "admin":
      return "Admin Roberts";
    default:
      return "User";
  }
}
