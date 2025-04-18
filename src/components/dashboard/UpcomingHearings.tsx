import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Users, Loader2 } from "lucide-react";
import { useFetchCollection } from "@/hooks/useFirebaseQuery";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Define hearing type
interface Hearing {
  id: string;
  caseId: string;
  title: string;
  type: string;
  date: string;
  time: string;
  virtual: boolean;
  courtroom?: string;
  judge?: string;
  participants?: string[];
  notes?: string;
  created_at?: string;
}

export function UpcomingHearings() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Fetch upcoming hearings from Firebase
  const { data: hearingsData, isLoading, isError } = useFetchCollection<Hearing>("hearings", {
    filters: [
      {
        field: "date",
        operator: ">=",
        value: today.toISOString().split('T')[0],
      }
    ],
    orderByField: "date",
    orderDirection: "asc",
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !hearingsData) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Unable to load hearings. Please try again later.
      </div>
    );
  }

  if (hearingsData.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No upcoming hearings found. Schedule your first hearing to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hearingsData.map((hearing) => (
        <div key={hearing.id} className="flex flex-col space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{hearing.title}</div>
            <Badge variant={hearing.virtual ? "default" : "outline"}>
              {hearing.virtual ? "Virtual" : "In-Person"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date(hearing.date).toLocaleDateString()} at {hearing.time}
            </span>
            <span>•</span>
            <span>{hearing.type}</span>
            <span>•</span>
            <span>{hearing.caseId}</span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            {hearing.virtual && (
              <Button 
                size="sm" 
                className="h-8"
                onClick={() => navigate(`/calendar?hearing=${hearing.id}&action=join`)}
              >
                <Video className="mr-1 h-3 w-3" />
                Join Virtually
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => navigate(`/calendar?hearing=${hearing.id}`)}
            >
              <Users className="mr-1 h-3 w-3" />
              Participants
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
