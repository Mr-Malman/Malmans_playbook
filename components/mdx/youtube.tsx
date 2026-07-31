"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Timestamp {
  time: string; // "12:30"
  label: string;
}

function toSeconds(t: string) {
  const parts = t.split(":").map(Number).reverse();
  return (parts[0] || 0) + (parts[1] || 0) * 60 + (parts[2] || 0) * 3600;
}

export function YouTube({
  id,
  title = "Video",
  timestamps = [],
}: {
  id: string;
  title?: string;
  timestamps?: Timestamp[];
}) {
  const [start, setStart] = React.useState<number | null>(null);
  const src = `https://www.youtube-nocookie.com/embed/${id}${
    start !== null ? `?start=${start}&autoplay=1` : ""
  }`;

  return (
    <div className="my-6 grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <div className="relative aspect-video">
          <iframe
            key={start ?? "default"}
            className="absolute inset-0 h-full w-full"
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      {timestamps.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Chapters
          </p>
          <ul className="space-y-0.5">
            {timestamps.map((ts) => (
              <li key={ts.time}>
                <button
                  onClick={() => setStart(toSeconds(ts.time))}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                    start === toSeconds(ts.time) && "bg-secondary"
                  )}
                >
                  <Play className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <span className="flex-1">{ts.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {ts.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
