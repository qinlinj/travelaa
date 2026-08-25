"use client";

import { buildSettlementGraph } from "@/lib/settlement-graph";
import { formatAmount } from "@/lib/format";
import type { Transfer } from "@/lib/settlement";

type SettlementPathsProps = {
  transfers: Transfer[];
  names: Record<string, string>;
  messy?: boolean;
  variant: "before" | "after";
};

export function SettlementPaths({
  transfers,
  names,
  messy = false,
  variant,
}: SettlementPathsProps) {
  const graph = buildSettlementGraph(transfers, names, { messy });

  if (graph.edges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Everyone is already settled. No transfers needed.
      </p>
    );
  }

  const markerId = `${variant}-arrow`;
  const stroke = variant === "before" ? "#9a4d4d" : "#3f6f64";
  const strokeWidth = variant === "before" ? 1.2 : 2.5;

  return (
    <svg
      role="img"
      aria-label={
        variant === "before"
          ? "Naive settlement paths"
          : "Simplified settlement paths"
      }
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      className="h-auto w-full"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill={stroke} />
        </marker>
      </defs>

      {graph.edges.map((edge) => (
        <g key={`${edge.from}-${edge.to}-${edge.amount}`}>
          <path
            d={edge.path}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={variant === "before" ? "5 4" : undefined}
            strokeOpacity={variant === "before" ? 0.78 : 1}
            markerEnd={`url(#${markerId})`}
          >
            <title>{edge.label}</title>
          </path>
          <text
            x={edge.labelX}
            y={edge.labelY - 6}
            textAnchor="middle"
            className="fill-foreground"
            fontSize="10"
            fontWeight={variant === "after" ? 600 : 400}
          >
            {formatAmount(edge.amount)}
          </text>
        </g>
      ))}

      {graph.fromNodes.map((node) => (
        <NodeMark key={`from-${node.id}`} node={node} tone="payer" />
      ))}
      {graph.toNodes.map((node) => (
        <NodeMark key={`to-${node.id}`} node={node} tone="receiver" />
      ))}
    </svg>
  );
}

function NodeMark({
  node,
  tone,
}: {
  node: { id: string; name: string; x: number; y: number };
  tone: "payer" | "receiver";
}) {
  const fill = tone === "payer" ? "#c46b3a" : "#3f6f64";

  return (
    <g>
      <circle cx={node.x} cy={node.y} r="8" fill={fill} />
      <text
        x={node.x}
        y={node.y - 14}
        textAnchor="middle"
        className="fill-foreground"
        fontSize="10"
        fontWeight="600"
      >
        {node.name}
      </text>
    </g>
  );
}
