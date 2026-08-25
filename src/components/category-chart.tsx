"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatAmount } from "@/lib/format";
import type { CategoryTotal } from "@/lib/category-breakdown";

const TRAVEL_CHART_COLORS = [
  "#3f6f64",
  "#c46b3a",
  "#d4a24c",
  "#4b7c9b",
  "#8b5e3c",
  "#6b7280",
  "#9a4d4d",
];

type CategoryChartProps = {
  data: CategoryTotal[];
};

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={108}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            formatter={(value) => [
              formatAmount(Number(value ?? 0)),
              "Spent",
            ]}
          />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((entry, index) => (
              <Cell
                key={entry.category}
                fill={TRAVEL_CHART_COLORS[index % TRAVEL_CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
