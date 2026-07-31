"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

type StepType = "recon" | "entry" | "exploit" | "privesc" | "impact" | "default";

interface Step {
  id: string;
  label: string;
  phase?: string;
  detail?: string;
  type?: StepType;
  x?: number;
  y?: number;
}

const TYPE_STYLES: Record<StepType, { ring: string; dot: string }> = {
  recon: { ring: "border-sky-500/60", dot: "bg-sky-500" },
  entry: { ring: "border-amber-500/60", dot: "bg-amber-500" },
  exploit: { ring: "border-rose-500/60", dot: "bg-rose-500" },
  privesc: { ring: "border-fuchsia-500/60", dot: "bg-fuchsia-500" },
  impact: { ring: "border-red-600/70", dot: "bg-red-600" },
  default: { ring: "border-emerald-500/60", dot: "bg-emerald-500" },
};

function StepNode({ data }: NodeProps<Step>) {
  const style = TYPE_STYLES[data.type ?? "default"];
  return (
    <div
      className={`w-[190px] rounded-lg border bg-card px-3 py-2 shadow-sm ${style.ring}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div className="mb-1 flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        {data.phase && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {data.phase}
          </span>
        )}
      </div>
      <div className="text-sm font-medium leading-snug text-foreground">
        {data.label}
      </div>
      {data.detail && (
        <div className="mt-1 text-xs leading-snug text-muted-foreground">
          {data.detail}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  );
}

const nodeTypes = { step: StepNode };

export function AttackPath({
  steps,
  edges: edgeSpec,
  height = 320,
}: {
  steps: Step[];
  /** [from, to, label?] triples; defaults to a linear chain */
  edges?: [string, string, string?][];
  height?: number;
}) {
  const nodes: Node<Step>[] = React.useMemo(
    () =>
      steps.map((s, i) => ({
        id: s.id,
        type: "step",
        position: { x: s.x ?? i * 250, y: s.y ?? 0 },
        data: s,
        draggable: true,
      })),
    [steps]
  );

  const edges: Edge[] = React.useMemo(() => {
    const spec =
      edgeSpec ??
      steps
        .slice(1)
        .map((s, i) => [steps[i].id, s.id] as [string, string]);
    return spec.map(([from, to, label], i) => ({
      id: `e-${from}-${to}-${i}`,
      source: from,
      target: to,
      label,
      animated: true,
      style: { stroke: "hsl(var(--primary))", strokeWidth: 1.5 },
      labelStyle: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
      labelBgStyle: { fill: "hsl(var(--background))" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
    }));
  }, [edgeSpec, steps]);

  return (
    <div
      className="my-6 overflow-hidden rounded-xl border border-border bg-muted/30"
      style={{ height }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        minZoom={0.3}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} className="!border-border" />
      </ReactFlow>
    </div>
  );
}
