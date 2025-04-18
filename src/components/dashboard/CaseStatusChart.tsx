
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Demo data
const data = [
  { name: "Pending", value: 65, color: "#1a81f8" },
  { name: "In Progress", value: 45, color: "#7cc2ff" },
  { name: "Adjourned", value: 22, color: "#32455c" },
  { name: "Closed", value: 24, color: "#aabcd1" },
];

export function CaseStatusChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" layout="horizontal" />
      </PieChart>
    </ResponsiveContainer>
  );
}
