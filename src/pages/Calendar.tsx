import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Plus, Search, MoreHorizontal, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/integrations/firebase/client";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

// Define hearing type
interface Hearing {
  id: string;
  caseId: string;
  title: string;
  type: string;
  date: string;
  time: string;
  virtual: boolean;
  judge: string;
  courtroom?: string;
  participants?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch hearings from Firebase
  useEffect(() => {
    const fetchHearings = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "hearings"),
          orderBy("date", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const hearingsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Handle date formatting if it's a Timestamp
          let dateStr = data.date;
          if (data.date instanceof Timestamp) {
            dateStr = data.date.toDate().toISOString().split('T')[0];
          }
          
          return {
            id: doc.id,
            ...data,
            date: dateStr
          };
        }) as Hearing[];
        
        setHearings(hearingsData);
      } catch (err) {
        console.error("Error fetching hearings:", err);
        setError("Failed to load hearings");
        toast({
          title: "Error",
          description: "Failed to load hearings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHearings();
  }, [toast]);
  
  const filteredHearings = hearings.filter(
    hearing =>
      (selectedDate
        ? hearing.date === format(selectedDate, "yyyy-MM-dd")
        : true) &&
      (searchQuery
        ? hearing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hearing.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hearing.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );
  
  // Count hearings for highlighting dates in the calendar
  const dateHasHearing = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return hearings.some(hearing => hearing.date === dateStr);
  };
  
  return (
    <Dashboard>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Court Calendar</h1>
            <p className="text-muted-foreground">
              Manage your hearings and court appointments
            </p>
          </div>
          <div className="flex space-x-2">
            <AddHearingDialog onHearingAdded={(hearing) => {
              setHearings(prev => [hearing, ...prev]);
              toast({
                title: "Hearing Scheduled",
                description: "The hearing has been successfully scheduled."
              });
            }} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Calendar</CardTitle>
                <CardDescription>
                  Select a date to view scheduled hearings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasHearing: date => dateHasHearing(date),
                  }}
                  modifiersStyles={{
                    hasHearing: { 
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      fontWeight: 'bold'
                    },
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Summary</CardTitle>
                <CardDescription>
                  Overview of your scheduled hearings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="p-3">
                        <div className="text-2xl font-bold">
                          {hearings.filter(h => new Date(h.date) >= new Date()).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Upcoming Hearings
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="text-2xl font-bold">
                          {selectedDate 
                            ? hearings.filter(h => h.date === format(selectedDate, "yyyy-MM-dd")).length 
                            : 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Selected Day
                        </div>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Next Hearing</h3>
                      {hearings
                        .filter(h => new Date(h.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 1)
                        .map(hearing => (
                          <Card key={hearing.id} className="p-3">
                            <div className="font-medium truncate">{hearing.title}</div>
                            <div className="text-sm text-muted-foreground">{hearing.caseId}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">
                                {new Date(hearing.date).toLocaleDateString()} at {hearing.time}
                              </span>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-8">
            <Tabs defaultValue="calendar" className="space-y-4">
              <div className="flex justify-between">
                <TabsList>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search hearings..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="calendar" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl">
                      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "All Hearings"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDate
                        ? `Hearings scheduled for ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
                        : "All upcoming hearings"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredHearings.length > 0 ? (
                      <div className="space-y-2 p-4">
                        {filteredHearings.map(hearing => (
                          <HearingCard key={hearing.id} hearing={hearing} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="mx-auto h-12 w-12 mb-4 text-muted" />
                        <h3 className="text-lg font-medium mb-2">No hearings found</h3>
                        <p className="mb-4">
                          {searchQuery
                            ? "No hearings match your search criteria"
                            : selectedDate
                            ? `No hearings scheduled for ${format(selectedDate, "MMMM d, yyyy")}`
                            : "No upcoming hearings scheduled"}
                        </p>
                        <Button variant="outline">Schedule a Hearing</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl">Hearings List</CardTitle>
                    <CardDescription>
                      All scheduled hearings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Judge</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              <div className="flex justify-center items-center">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span>Loading hearings...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredHearings.length > 0 ? (
                          filteredHearings.map(hearing => (
                            <TableRow key={hearing.id}>
                              <TableCell>{hearing.caseId}</TableCell>
                              <TableCell className="font-medium">{hearing.title}</TableCell>
                              <TableCell>{hearing.type}</TableCell>
                              <TableCell>{new Date(hearing.date).toLocaleDateString()}</TableCell>
                              <TableCell>{hearing.time}</TableCell>
                              <TableCell>{hearing.judge}</TableCell>
                              <TableCell>
                                <Badge variant={hearing.virtual ? "outline" : "secondary"}>
                                  {hearing.virtual ? "Virtual" : "In Person"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <HearingActionsDropdown />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                              {searchQuery
                                ? "No hearings match your search criteria"
                                : "No hearings scheduled"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

interface HearingCardProps {
  hearing: Hearing;
}

function HearingCard({ hearing }: HearingCardProps) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{hearing.title}</h3>
            <p className="text-sm text-muted-foreground">{hearing.caseId}</p>
          </div>
          <HearingActionsDropdown />
        </div>
        <Separator className="my-3" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Date & Time</p>
            <p className="text-sm">{new Date(hearing.date).toLocaleDateString()} at {hearing.time}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm">{hearing.type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Judge</p>
            <p className="text-sm">{hearing.judge}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mode</p>
            <Badge variant={hearing.virtual ? "outline" : "secondary"} className="mt-1">
              {hearing.virtual ? "Virtual" : "In Person"}
            </Badge>
          </div>
          {hearing.virtual ? (
            <div className="col-span-2">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Join Virtual Hearing
              </Button>
            </div>
          ) : (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm">{hearing.courtroom || "Not specified"}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function HearingActionsDropdown() {
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
        <DropdownMenuItem>Edit Hearing</DropdownMenuItem>
        <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
        <DropdownMenuItem>Send Notification</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Cancel Hearing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AddHearingDialogProps {
  onHearingAdded?: (hearing: Hearing) => void;
}

function AddHearingDialog({ onHearingAdded }: AddHearingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally handle creating the hearing in Firestore
    
    setIsSubmitting(true);
    
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock hearing for demo
      const newHearing: Hearing = {
        id: `HEAR-${Date.now()}`,
        caseId: "CIV-2023-45",
        title: "Initial Conference",
        type: "Status Conference",
        date: format(date || new Date(), "yyyy-MM-dd"),
        time: "09:30 AM",
        virtual: true,
        judge: "Judge Michael Reynolds",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Trigger callback if provided
      if (onHearingAdded) {
        onHearingAdded(newHearing);
      }
      
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error creating hearing:", error);
      toast({
        title: "Error",
        description: "Failed to schedule hearing. Please try again.",
        variant: "destructive",
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
          Schedule Hearing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Hearing</DialogTitle>
          <DialogDescription>
            Create a new court hearing or appointment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="case">Case</Label>
              <select
                id="case"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CIV-2023-45">CIV-2023-45 - Smith vs. Albany Corp</option>
                <option value="CRM-2023-28">CRM-2023-28 - State vs. Johnson</option>
                <option value="FAM-2023-15">FAM-2023-15 - Thompson Custody</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Hearing Title</Label>
              <Input id="title" placeholder="e.g., Initial Conference, Motion Hearing" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Hearing Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Status Conference">Status Conference</option>
                <option value="Motion Hearing">Motion Hearing</option>
                <option value="Trial">Trial</option>
                <option value="Arraignment">Arraignment</option>
                <option value="Sentencing">Sentencing</option>
                <option value="Settlement Conference">Settlement Conference</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <div className="absolute inset-0 rounded-md">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" defaultValue="09:00" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="judge">Judge</Label>
              <Input id="judge" placeholder="Judge name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mode">Hearing Mode</Label>
              <select
                id="mode"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location/Courtroom (for in-person)</Label>
              <Input id="location" placeholder="e.g., Courtroom 304" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Hearing"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
