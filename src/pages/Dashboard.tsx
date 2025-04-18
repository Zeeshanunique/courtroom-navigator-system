
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard as DashboardLayout } from "@/components/layout/Dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Calendar, Clock, FileCheck, FilePlus, User, Users, Video } from "lucide-react";
import { CaseStatusChart } from "@/components/dashboard/CaseStatusChart";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingHearings } from "@/components/dashboard/UpcomingHearings";

export default function DashboardPage() {
  const role = useUserRole();
  
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Welcome, {getDemoNameByRole(role)}</h1>
        
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
                value="156" 
                description="Active cases in the system"
                icon={FileCheck} 
                trend="+12% from last month"
              />
              <StatsCard 
                title="Upcoming Hearings" 
                value="24" 
                description="Scheduled for next 7 days"
                icon={Video} 
                trend="+3 since yesterday"
              />
              <StatsCard 
                title="Documentation" 
                value="89%" 
                description="Completion rate"
                icon={FilePlus} 
                trend="+4% from last week"
              />
              <StatsCard 
                title={role === "judge" ? "Cases Presided" : "Cases Assigned"} 
                value="42" 
                description="Currently active"
                icon={User} 
                trend=""
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
                  <QuickAccessButton icon={FilePlus} text="Register New Case" />
                  <QuickAccessButton icon={Calendar} text="Schedule Hearing" />
                  <QuickAccessButton icon={Clock} text="View Calendar" />
                  <QuickAccessButton icon={Users} text="Manage Case Access" />
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
                <p>Case listing would appear here...</p>
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
                <p>Hearing schedule would appear here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
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
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && <p className="text-xs text-primary mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

interface QuickAccessButtonProps {
  icon: React.FC<{ className?: string }>;
  text: string;
}

function QuickAccessButton({ icon: Icon, text }: QuickAccessButtonProps) {
  return (
    <Button variant="outline" className="w-full justify-start">
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
