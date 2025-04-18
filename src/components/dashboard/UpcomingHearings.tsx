
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Users } from "lucide-react";

// Demo data
const hearings = [
  { id: "H-1234", caseId: "CIV-2023-45", title: "Smith vs. Albany Corp", type: "Pre-trial", date: "2023-04-20", time: "09:30 AM", virtual: true },
  { id: "H-1235", caseId: "CRM-2023-28", title: "State vs. Johnson", type: "Hearing", date: "2023-04-21", time: "11:00 AM", virtual: true },
  { id: "H-1236", caseId: "FAM-2023-15", title: "Thompson Custody", type: "Mediation", date: "2023-04-22", time: "14:00 PM", virtual: false },
];

export function UpcomingHearings() {
  return (
    <div className="space-y-4">
      {hearings.map((hearing) => (
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
              <Button size="sm" className="h-8">
                <Video className="mr-1 h-3 w-3" />
                Join Virtually
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-8">
              <Users className="mr-1 h-3 w-3" />
              Participants
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
