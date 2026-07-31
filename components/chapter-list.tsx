"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { useCourseProgress } from "@/components/progress/use-progress";
import type { ChapterMeta } from "@/lib/courses";

export function ChapterList({
  courseSlug,
  chapters,
}: {
  courseSlug: string;
  chapters: ChapterMeta[];
}) {
  const { isComplete, mounted } = useCourseProgress(courseSlug);

  return (
    <ol className="space-y-2">
      {chapters.map((ch, i) => {
        const done = mounted && isComplete(ch.slug);
        return (
          <li key={ch.slug}>
            <Link
              href={`/courses/${courseSlug}/${ch.slug}`}
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={cn(
                      "font-medium leading-snug text-foreground transition-colors group-hover:text-primary",
                      done && "text-muted-foreground"
                    )}
                  >
                    {ch.title}
                  </h3>
                </div>
                {ch.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {ch.description}
                  </p>
                )}
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {formatMinutes(ch.duration)}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
