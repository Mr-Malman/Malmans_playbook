"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => m.default);
  }
  return mermaidPromise;
}

let counter = 0;

export function Mermaid({
  chart,
  className,
}: {
  chart: string;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [id] = React.useState(() => `mermaid-${counter++}`);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mermaid = await loadMermaid();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: resolvedTheme === "dark" ? "dark" : "default",
          themeVariables: {
            fontFamily: "var(--font-sans)",
            primaryColor: resolvedTheme === "dark" ? "#0f172a" : "#f1f5f9",
            primaryTextColor: resolvedTheme === "dark" ? "#e2e8f0" : "#0f172a",
            lineColor: resolvedTheme === "dark" ? "#334155" : "#94a3b8",
          },
        });
        const { svg } = await mermaid.render(id, chart.trim());
        if (active) {
          setSvg(svg);
          setError("");
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      active = false;
    };
  }, [chart, resolvedTheme, id]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 font-mono text-xs text-destructive">
        Mermaid render error: {error}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 scrollbar-thin [&_svg]:h-auto [&_svg]:max-w-full",
        !svg && "min-h-[120px] animate-pulse",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
