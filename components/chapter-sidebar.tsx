"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCourseProgress } from "@/components/progress/use-progress";
import type { ChapterMeta } from "@/lib/courses";

export function ChapterSidebar({
  courseSlug,
  courseTitle,
  chapters,
}: {
  courseSlug: string;
  courseTitle: string;
  chapters: ChapterMeta[];
}) {
  const pathname = usePathname();
  const { isComplete, mounted } = useCourseProgress(courseSlug);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Course overview
        </Link>
        <p className="mt-2 font-semibold leading-tight">{courseTitle}</p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2">
          {chapters.map((ch, i) => {
            const href = `/courses/${courseSlug}/${ch.slug}`;
            const active = pathname === href;
            const done = mounted && isComplete(ch.slug);
            return (
              <Link
                key={ch.slug}
                href={href}
                className={cn(
                  "flex items-start gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-4 w-4",
                        active ? "text-primary" : "text-muted-foreground/40"
                      )}
                    />
                  )}
                </span>
                <span className="flex-1 leading-snug">
                  <span className="mr-1.5 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {ch.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
