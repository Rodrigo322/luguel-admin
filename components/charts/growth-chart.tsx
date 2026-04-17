"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface GrowthChartProps {
  usersCount: number;
  rentalsCount: number;
}

function generateSeries(usersCount: number, rentalsCount: number) {
  const months = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];

  return months.map((month, index) => {
    const progressFactor = (index + 1) / months.length;

    return {
      month,
      users: Math.max(1, Math.round(usersCount * (0.45 + progressFactor * 0.55))),
      rentals: Math.max(1, Math.round(rentalsCount * (0.4 + progressFactor * 0.6)))
    };
  });
}

export function GrowthChart({ usersCount, rentalsCount }: GrowthChartProps) {
  const data = generateSeries(usersCount, rentalsCount);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#95a3c8" axisLine={false} tickLine={false} />
          <YAxis stroke="#95a3c8" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f1730",
              border: "1px solid rgba(177, 188, 255, 0.2)",
              borderRadius: 12
            }}
          />
          <Line type="monotone" dataKey="users" stroke="#8f90ff" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="rentals" stroke="#d9deef" strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
