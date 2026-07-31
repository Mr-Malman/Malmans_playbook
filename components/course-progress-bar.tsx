"use client";

import { CheckCircle2 } from "lucide-react";
import { useCourseProgress } from "@/components/progress/use-progress";

export function CourseProgressBar({
  courseSlug,
  total,
}: {
  courseSlug: string;
  total: number;
}) {
  const { completed, mounted } = useCourseProgress(courseSlug);
  const done = mounted ? completed.length : 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Your progress
        </span>
        <span className="text-muted-foreground">
          {done} / {total} chapters
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {pct}% complete{pct === 100 ? " — nice work!" : ""}
      </p>
    </div>
  );
}
