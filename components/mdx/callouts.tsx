import * as React from "react";
import {
  AlertTriangle,
  Info,
  Lightbulb,
  ShieldCheck,
  Skull,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "tip" | "warning" | "danger" | "note";

const ALERT_STYLES: Record<
  AlertVariant,
  { wrap: string; icon: React.ReactNode; label: string }
> = {
  info: {
    wrap: "border-accent/40 bg-accent/10 text-foreground",
    icon: <Info className="h-4 w-4 text-accent" />,
    label: "Info",
  },
  tip: {
    wrap: "border-primary/40 bg-primary/10 text-foreground",
    icon: <Lightbulb className="h-4 w-4 text-primary" />,
    label: "Tip",
  },
  warning: {
    wrap: "border-warning/40 bg-warning/10 text-foreground",
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
    label: "Warning",
  },
  danger: {
    wrap: "border-destructive/40 bg-destructive/10 text-foreground",
    icon: <Skull className="h-4 w-4 text-destructive" />,
    label: "Danger",
  },
  note: {
    wrap: "border-border bg-muted/50 text-foreground",
    icon: <Info className="h-4 w-4 text-muted-foreground" />,
    label: "Note",
  },
};

export function Alert({
  variant = "info",
  title,
  children,
}: {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const s = ALERT_STYLES[variant];
  return (
    <div className={cn("my-5 rounded-lg border p-4", s.wrap)}>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
        {s.icon}
        <span>{title ?? s.label}</span>
      </div>
      <div className="text-sm leading-6 text-foreground/85 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function DefenseNote({
  title = "Defensive Countermeasure",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-5 rounded-lg border border-success/40 bg-success/10 p-4">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-success">
        <ShieldCheck className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="text-sm leading-6 text-foreground/85 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function LabStep({
  n,
  title,
  children,
}: {
  n: number | string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 font-semibold text-foreground">{title}</div>
        <div className="text-sm leading-6 text-foreground/85 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 border-l border-border pl-4 [counter-reset:step]">
      {children}
    </div>
  );
}

type Severity = "critical" | "high" | "medium" | "low";
const SEV_STYLES: Record<Severity, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/40",
  high: "bg-warning/15 text-warning border-warning/40",
  medium: "bg-accent/15 text-accent border-accent/40",
  low: "bg-muted text-muted-foreground border-border",
};

export function CVEBadge({
  id,
  severity = "high",
  score,
}: {
  id: string;
  severity?: Severity;
  score?: number;
}) {
  return (
    <a
      href={`https://nvd.nist.gov/vuln/detail/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mx-0.5 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 align-middle font-mono text-xs font-medium no-underline transition-opacity hover:opacity-80",
        SEV_STYLES[severity]
      )}
    >
      {id}
      {typeof score === "number" && <span className="opacity-80">· {score}</span>}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
