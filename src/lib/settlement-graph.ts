import { formatAmount } from "@/lib/format";
import type { Transfer } from "@/lib/settlement";

export const SETTLEMENT_GRAPH_WIDTH = 320;
const EMPTY_HEIGHT = 80;
const ROW_HEIGHT = 64;
const TOP_PAD = 28;
const LEFT_X = 40;
const RIGHT_X = 280;

export type GraphNode = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  amount: number;
  path: string;
  label: string;
  labelX: number;
  labelY: number;
};

export type SettlementGraph = {
  width: number;
  height: number;
  fromNodes: GraphNode[];
  toNodes: GraphNode[];
  edges: GraphEdge[];
};

export function buildSettlementGraph(
  transfers: Transfer[],
  names: Record<string, string>,
  options: { messy?: boolean } = {},
): SettlementGraph {
  if (transfers.length === 0) {
    return {
      width: SETTLEMENT_GRAPH_WIDTH,
      height: EMPTY_HEIGHT,
      fromNodes: [],
      toNodes: [],
      edges: [],
    };
  }

  const fromIds = uniqueInOrder(transfers.map((transfer) => transfer.from));
  const toIds = uniqueInOrder(transfers.map((transfer) => transfer.to));
  const height =
    TOP_PAD * 2 + Math.max(fromIds.length, toIds.length) * ROW_HEIGHT;

  const fromNodes = fromIds.map((id, index) => ({
    id,
    name: names[id] ?? "Unknown",
    x: LEFT_X,
    y: nodeY(index, fromIds.length, height),
  }));
  const toNodes = toIds.map((id, index) => ({
    id,
    name: names[id] ?? "Unknown",
    x: RIGHT_X,
    y: nodeY(index, toIds.length, height),
  }));

  const fromById = new Map(fromNodes.map((node) => [node.id, node]));
  const toById = new Map(toNodes.map((node) => [node.id, node]));

  const edges = transfers.map((transfer, index) => {
    const from = fromById.get(transfer.from);
    const to = toById.get(transfer.to);
    if (!from || !to) {
      throw new Error("Transfer refers to a node that is not in the graph.");
    }

    const fromName = names[transfer.from] ?? "Unknown";
    const toName = names[transfer.to] ?? "Unknown";
    const path = edgePath(from, to, index, transfers.length, options.messy);

    return {
      from: transfer.from,
      to: transfer.to,
      amount: transfer.amount,
      path,
      label: `${fromName} → ${toName} ${formatAmount(transfer.amount)}`,
      labelX: (from.x + to.x) / 2,
      labelY: midpointY(from.y, to.y, index, transfers.length, options.messy),
    };
  });

  return {
    width: SETTLEMENT_GRAPH_WIDTH,
    height,
    fromNodes,
    toNodes,
    edges,
  };
}

function uniqueInOrder(ids: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push(id);
    }
  }

  return ordered;
}

function nodeY(index: number, count: number, height: number): number {
  if (count === 1) {
    return height / 2;
  }

  const usable = height - TOP_PAD * 2;
  return TOP_PAD + (usable * index) / (count - 1);
}

function edgePath(
  from: GraphNode,
  to: GraphNode,
  index: number,
  total: number,
  messy = false,
): string {
  const startX = from.x + 18;
  const endX = to.x - 18;
  const midX = (startX + endX) / 2;
  const sway = messy ? (index - (total - 1) / 2) * 36 : 0;

  return `M ${startX} ${from.y} C ${midX} ${from.y + sway}, ${midX} ${to.y - sway}, ${endX} ${to.y}`;
}

function midpointY(
  fromY: number,
  toY: number,
  index: number,
  total: number,
  messy = false,
): number {
  const sway = messy ? (index - (total - 1) / 2) * 10 : 0;
  return (fromY + toY) / 2 + sway;
}

export function memberNamesById(
  members: { id: string; name: string }[],
): Record<string, string> {
  return Object.fromEntries(members.map((member) => [member.id, member.name]));
}
