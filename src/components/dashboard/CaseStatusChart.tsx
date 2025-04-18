import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useFetchCollection } from "@/hooks/useFirebaseQuery";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Define status colors
const statusColors = {
  "pending": "#1a81f8",
  "in-progress": "#7cc2ff",
  "adjourned": "#32455c",
  "closed": "#aabcd1",
  "default": "#94a3b8"
};

// Define case type
interface Case {
  id: string;
  status: string;
}

export function CaseStatusChart() {
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  // Fetch all cases to calculate status distribution
  const { data: cases, isLoading, isError } = useFetchCollection<Case>("cases");
  
  // Process data for chart whenever cases change
  useEffect(() => {
    if (cases && cases.length > 0) {
      // Count cases by status
      const statusCounts: Record<string, number> = {};
      
      cases.forEach(caseItem => {
        // Normalize status to handle case variations
        const status = (caseItem.status || "Unknown").toLowerCase();
        
        // Standardize status names
        let normalizedStatus = status;
        if (status === "in progress") normalizedStatus = "in-progress";
        if (status === "active") normalizedStatus = "in-progress";
        if (status === "completed") normalizedStatus = "closed";
        
        statusCounts[normalizedStatus] = (statusCounts[normalizedStatus] || 0) + 1;
      });
      
      // Convert to chart data format
      const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
        value: count,
        color: statusColors[status] || statusColors.default
      }));
      
      setChartData(data);
    }
  }, [cases]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !cases || cases.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
        <p>{isError ? "Error loading data" : "No case data available"}</p>
        <p className="text-sm">Add cases to view status distribution</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" layout="horizontal" />
      </PieChart>
    </ResponsiveContainer>
  );
}
