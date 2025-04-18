
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";

// Demo data
const recentCases = [
  { id: "CIV-2023-45", title: "Smith vs. Albany Corp", type: "Civil", status: "pending", date: "2023-04-12" },
  { id: "CRM-2023-28", title: "State vs. Johnson", type: "Criminal", status: "in-progress", date: "2023-04-10" },
  { id: "FAM-2023-15", title: "Thompson Custody Case", type: "Family", status: "adjourned", date: "2023-04-08" },
  { id: "CIV-2023-42", title: "Roberts vs. City Council", type: "Civil", status: "pending", date: "2023-04-06" },
];

export function RecentCases() {
  return (
    <div className="space-y-4">
      {recentCases.map((caseItem) => (
        <div key={caseItem.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">{caseItem.title}</div>
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <span>{caseItem.id}</span>
                <span>•</span>
                <span>{caseItem.type}</span>
                <span>•</span>
                <span>{new Date(caseItem.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CaseStatusBadge status={caseItem.status} />
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
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
