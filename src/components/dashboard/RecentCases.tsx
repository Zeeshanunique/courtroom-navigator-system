import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import { useFetchCollection } from "@/hooks/useFirebaseQuery";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Define case type
interface Case {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  case_number?: string;
  courtDate?: string;
  client?: string;
}

export function RecentCases() {
  const navigate = useNavigate();
  // Fetch most recent 5 cases from Firebase
  const { data: casesData, isLoading, isError } = useFetchCollection<Case>("cases", {
    orderByField: "created_at",
    orderDirection: "desc",
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !casesData) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Unable to load cases. Please try again later.
      </div>
    );
  }

  if (casesData.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No cases found. Add your first case to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {casesData.map((caseItem) => (
        <div key={caseItem.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">{caseItem.title}</div>
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <span>{caseItem.case_number || caseItem.id.substring(0, 8)}</span>
                <span>•</span>
                <span>{caseItem.type}</span>
                <span>•</span>
                <span>{caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : "Unknown"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CaseStatusBadge status={caseItem.status} />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/cases?id=${caseItem.id}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CaseStatusBadge({ status }: { status: string }) {
  switch (status?.toLowerCase()) {
    case "pending":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Pending</Badge>;
    case "in-progress":
    case "in progress":
    case "active":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">In Progress</Badge>;
    case "adjourned":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Adjourned</Badge>;
    case "closed":
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Closed</Badge>;
    default:
      return <Badge>{status || "Unknown"}</Badge>;
  }
}
