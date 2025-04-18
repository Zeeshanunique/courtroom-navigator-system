
import { useState } from "react";
import { format, startOfToday, parseISO, isToday, isSameDay } from "date-fns";
import { Dashboard } from "@/components/layout/Dashboard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock hearing data
const hearings = [
  { id: "H-1234", caseId: "CIV-2023-45", title: "Smith vs. Albany Corp", type: "Pre-trial Conference", date: "2023-04-20", time: "09:30", virtual: true, judge: "Hon. Rebecca Martinez" },
  { id: "H-1235", caseId: "CRM-2023-28", title: "State vs. Johnson", type: "Hearing", date: "2023-04-20", time: "11:00", virtual: true, judge: "Hon. Daniel Chen" },
  { id: "H-1236", caseId: "FAM-2023-15", title: "Thompson Custody", type: "Mediation", date: "2023-04-22", time: "14:00", virtual: false, judge: "Hon. Rebecca Martinez" },
  { id: "H-1237", caseId: "CIV-2023-42", title: "Roberts vs. City Council", type: "Status Conference", date: "2023-04-25", time: "10:00", virtual: true, judge: "Hon. Rebecca Martinez" },
  { id: "H-1238", caseId: "CRM-2023-27", title: "State vs. Williams", type: "Arraignment", date: "2023-04-21", time: "09:00", virtual: false, judge: "Hon. Daniel Chen" },
];

export default function CalendarPage() {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [view, setView] = useState<"day" | "week" | "month">("day");
  
  // Filter hearings for the selected date
  const filteredHearings = hearings.filter(hearing => 
    isSameDay(parseISO(hearing.date), selectedDate)
  );
  
  // Calculate if there are hearings on specific dates
  const hasHearingOn = (date: Date) => {
    return hearings.some(hearing => 
      isSameDay(parseISO(hearing.date), date)
    );
  };

  return (
    <Dashboard>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage and view all scheduled hearings and court appointments
          </p>
        </div>
        
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="hearings">My Hearings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar Sidebar */}
              <Card className="md:w-80">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Date</h3>
                    <Button variant="ghost" size="sm" disabled={isToday(selectedDate)} onClick={() => setSelectedDate(today)}>
                      Today
                    </Button>
                  </div>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiersStyles={{
                      today: {
                        fontWeight: "bold",
                        color: "var(--primary)"
                      }
                    }}
                    modifiers={{
                      hasHearing: (date) => hasHearingOn(date)
                    }}
                    modifiersClassNames={{
                      hasHearing: "bg-primary text-primary-foreground font-medium rounded-full"
                    }}
                  />
                </CardContent>
              </Card>
              
              {/* Schedule Content */}
              <div className="flex-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">
                        {format(selectedDate, "MMMM d, yyyy")}
                        {isToday(selectedDate) && <span className="ml-2 text-sm font-normal text-primary">(Today)</span>}
                      </h2>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setView("day")} className={cn(view === "day" && "bg-muted")}>Day</Button>
                        <Button variant="outline" size="sm" onClick={() => setView("week")} className={cn(view === "week" && "bg-muted")}>Week</Button>
                        <Button variant="outline" size="sm" onClick={() => setView("month")} className={cn(view === "month" && "bg-muted")}>Month</Button>
                      </div>
                    </div>
                    
                    {/* Day Schedule */}
                    <div className="space-y-4">
                      {filteredHearings.length > 0 ? (
                        <div className="space-y-4">
                          {/* Group by time and sort */}
                          {filteredHearings
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map(hearing => (
                              <div key={hearing.id} className="flex border rounded-md overflow-hidden">
                                <div className="w-16 bg-muted flex flex-col items-center justify-center p-2 border-r">
                                  <span className="text-sm font-medium">
                                    {hearing.time}
                                  </span>
                                </div>
                                <div className="flex-1 p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-medium">{hearing.title}</h3>
                                    <Badge variant={hearing.virtual ? "default" : "outline"}>
                                      {hearing.virtual ? "Virtual" : "In-Person"}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{hearing.type}</div>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-2">
                                    <span className="flex items-center">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      Courtroom 3B
                                    </span>
                                    <span className="flex items-center">
                                      <User className="mr-1 h-3 w-3" />
                                      {hearing.judge}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="mr-1 h-3 w-3" />
                                      30 minutes
                                    </span>
                                  </div>
                                  <div className="flex space-x-2 mt-3">
                                    {hearing.virtual && (
                                      <Button size="sm">
                                        <Video className="mr-1 h-3 w-3" />
                                        Join Virtual
                                      </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                      <Users className="mr-1 h-3 w-3" />
                                      Participants
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No hearings scheduled for this date
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hearings">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4">My Upcoming Hearings</h2>
                
                <div className="space-y-4">
                  {hearings
                    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                    .map(hearing => (
                      <div key={hearing.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{hearing.title}</h3>
                          <Badge variant={hearing.virtual ? "default" : "outline"}>
                            {hearing.virtual ? "Virtual" : "In-Person"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">{hearing.type}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {format(parseISO(hearing.date), "MMMM d, yyyy")}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {hearing.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            Courtroom 3B
                          </span>
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {hearing.judge}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {hearing.virtual && (
                            <Button size="sm">
                              <Video className="mr-1 h-3 w-3" />
                              Join Virtual
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}
