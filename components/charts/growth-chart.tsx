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
          <XAxis dataKey="month" stroke="var(--shell-foreground-dim)" axisLine={false} tickLine={false} />
          <YAxis stroke="var(--shell-foreground-dim)" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--shell-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12
            }}
          />
          <Line type="monotone" dataKey="users" stroke="var(--accent)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="rentals" stroke="var(--shell-foreground-dim)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
