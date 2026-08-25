import { describe, expect, it } from "vitest";

import { buildSettlementGraph } from "@/lib/settlement-graph";
import type { Transfer } from "@/lib/settlement";

const names = {
  alice: "Alice",
  bob: "Bob",
  carol: "Carol",
  dave: "Dave",
};

const transfers: Transfer[] = [
  { from: "carol", to: "alice", amount: 25 },
  { from: "carol", to: "bob", amount: 15 },
  { from: "dave", to: "alice", amount: 25 },
  { from: "dave", to: "bob", amount: 15 },
];

describe("buildSettlementGraph", () => {
  it("returns an empty graph when there are no transfers", () => {
    expect(buildSettlementGraph([], names)).toEqual({
      width: 320,
      height: 80,
      fromNodes: [],
      toNodes: [],
      edges: [],
    });
  });

  it("places payers on the left, receivers on the right, and names every edge", () => {
    const graph = buildSettlementGraph(transfers, names);

    expect(graph.fromNodes.map((node) => node.name)).toEqual(["Carol", "Dave"]);
    expect(graph.toNodes.map((node) => node.name)).toEqual(["Alice", "Bob"]);
    expect(graph.edges).toHaveLength(4);
    expect(graph.edges.every((edge) => edge.path.startsWith("M"))).toBe(true);
    expect(graph.edges.map((edge) => edge.label)).toEqual([
      "Carol → Alice 25.00",
      "Carol → Bob 15.00",
      "Dave → Alice 25.00",
      "Dave → Bob 15.00",
    ]);
  });

  it("uses messier control points for the before-path", () => {
    const tidy = buildSettlementGraph(transfers, names, { messy: false });
    const messy = buildSettlementGraph(transfers, names, { messy: true });

    expect(messy.edges.map((edge) => edge.path)).not.toEqual(
      tidy.edges.map((edge) => edge.path),
    );
  });
});
